let teamcity = "https://teamcity.vvvv.org";
let proxy = "https://api.codetabs.com/v1/proxy?quest=";
let builds = "/guestAuth/app/rest/builds/?status=success&buildType=vvvv_gamma_stride_Build&state=finished&count=3"


var tip = tippy('#previewButton', {
    content: 'Loading...',
    placement:'right',
    arrow:true,
    trigger:'click',
    animation: 'fade',
    allowHTML: true,
    hideOnClick: true,
    interactive: true,
    maxWidth: 'none',
    duration: [200, 0],
    onCreate(instance) {
        instance._isLoaded = false;
      },

    onShow(instance) {
        if (!instance._isLoaded)
        {
            getLatestBuild()
            .then (content => {
                instance.setContent(content);
                instance._isLoaded = true;
                var closeButton = instance.popper.getElementsByClassName('close')[0];
                closeButton.onclick = function() {
                    instance.hide();
                }
            });
        }
      },
  });

async function getLatestBuild()
{
    var previews = [];

    let link = teamcity+builds;

    var previews = await fetchData(link);

    var div="<table>";

    for (var preview of previews)
    {
        div +=`<tr>  
            <td><a href="${teamcity}${preview.link}" class="btn btn-secondary previewButton" onclick="plausible('downloadPreview')">Preview ${preview.buildNumber}</a></td>
            <td class="date">${preview.date}</td>
            <td><a href="${preview.changesLink}" target="_blank" class="changes">Changes</a></td>
        </tr>`; 
    }

    div+="</table>";

    document.getElementById('gammaPreviews').innerHTML = div;
    var template = document.getElementById('previewDownloadTemplate').innerHTML;

    return template;
}

async function fetchData(link)
{
    var previews = []
    let versionPattern = /(.*?)\+/;

    var builds = await fetch(link)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
        return data.getElementsByTagName("build");      
    })

    for (let build of builds) {
        
        let buildNumber = build.getAttribute("number");
        let id = build.getAttribute ("id");
        let href = build.getAttribute ("href");

        if (href != null)
        {
            await fetch(proxy + teamcity + href + "/artifacts/children")
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                var file = data.querySelector('file content[href$=".exe"]');
                let stamp = data.querySelector('file[modificationTime]').getAttribute('modificationTime');           

                if (file != null)
                {
                    var exeLink = file.getAttribute('href');

                    if (exeLink != null)
                    {
                        let shortNumber = buildNumber.match(versionPattern)[1];
                        let changes = teamcity+`/viewLog.html?buildId=${id}&tab=buildChangesDiv`;
                        previews.push ({link: exeLink, buildNumber: shortNumber, changesLink: changes, date: getDate(stamp)});
                    }
                }   
            })
        }
    }

    return previews;
}

function getDate(stamp)
{
    var yyyy = stamp.substring(0,4);
    var mm = stamp.substring(4,6);
    var dd = stamp.substring(6,8);
    var H = stamp.substring(9,11);
    var M = stamp.substring(11,13);
                
    return `${dd}.${mm}.${yyyy} ${H}:${M}`;
}