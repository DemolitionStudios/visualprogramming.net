//getLatestBuild();

function getLatestBuild()
{
    let teamcity = "https://teamcity.vvvv.org";
    let proxy = "https://api.codetabs.com/v1/proxy?quest=";
    let builds = "/guestAuth/app/rest/builds/?status=success&buildType=vvvv_gamma_stride_Build&state=finished&count=3"
    let versionPattern = /(.*?)\+/;
    let link = proxy+teamcity+builds;
    //let link = teamcity+builds

    fetch(link)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            var builds = data.getElementsByTagName("build");
            

            for (let build of builds) {
                let buildNumber = build.getAttribute("number");
                let href = build.getAttribute ("href");
                let link = "";

                if (href != null)
                {
                    fetch(proxy + teamcity + href + "/artifacts/children")
                    .then(response => response.text())
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                    .then(data => {
                        var file = data.querySelector('file content[href$=".exe"]');
                        
                        if (file != null)
                        {
                            link = file.getAttribute('href');
                        }   
                    })
                }

                if (link != null)
                {
                   let shortNumber = buildNumber.match(versionPattern)[1];
                   document.getElementById('gammaDownloads').innerHTML += 
                   `<a href="${teamcity+link}" class="btn btn-secondary previewButton">Preview ${shortNumber}</a>`;  
                }
            }

            document.getElementById('gammaDownloads').style = "visibility: visible"; 
        })
}