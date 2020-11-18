getLatestBuild();

function getLatestBuild()
{
    let teamcity = "https://teamcity.vvvv.org"
    let builds = "/guestAuth/app/rest/builds/buildType:vvvv_gamma_stride_Build,branch:default:any,status:success/artifacts/children"
    let versionPattern = /vvvv_gamma_(\d{4}\.\d)/;

    fetch(teamcity+builds)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            var file = data.querySelector('file content[href$=".exe"]');
            
            if (file != null)
            {
                var href = file.getAttribute('href');
                var version=href.match(versionPattern)[1];

                document.getElementById('previewButton').href = teamcity+href;
                document.getElementById('previewVersion').innerHTML += " " + version;
                document.getElementById('gammaDownloads').style = "visibility: visible";
            }   
        })
}