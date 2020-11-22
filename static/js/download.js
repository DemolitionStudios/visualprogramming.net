let teamcity = "https://teamcity.vvvv.org";
let proxy = "https://api.codetabs.com/v1/proxy?quest=";
let builds = "/guestAuth/app/rest/builds/?status=success&buildType=vvvv_gamma_stride_Build&state=finished&count=3"


async function getLatestBuild()
{
    var previews = [];

    //let link = proxy+teamcity+builds;
    let link = teamcity+builds

    var loading = document.getElementById('loading');

    if (loading !=null )
    {
        var previews = await fetchData(link);

        console.log (previews)

        for (var preview of previews)
        {
            document.getElementById('previews').innerHTML += 
            `<a href="${teamcity}${preview.link}" class="btn btn-secondary previewButton">Preview ${preview.buildNumber}</a>`+
            `&nbsp; &nbsp; <a href="${preview.changesLink}" target="_blank" class="changes">Changes</a><br/>`;
        }

        document.getElementById('loading').remove();   
    }
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

                if (file != null)
                {
                    var exeLink = file.getAttribute('href');

                    if (exeLink != null)
                    {
                        let shortNumber = buildNumber.match(versionPattern)[1];
                        let changes = `https://teamcity.vvvv.org/viewLog.html?buildId=${id}&tab=buildChangesDiv`;
                        previews.push ({link: exeLink, buildNumber: shortNumber, changesLink: changes});
                    }
                }   
            })
        }
    }

    return previews;
}