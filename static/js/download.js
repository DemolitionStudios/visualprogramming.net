
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