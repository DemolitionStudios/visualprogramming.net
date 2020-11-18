getLatestBuild();

function getLatestBuild()
{
    let proxy = "https://api.codetabs.com/v1/proxy?quest="
    let teamcity = "https://teamcity.vvvv.org"
    let builds = "/guestAuth/app/rest/builds/buildType:vvvv_gamma_stride_Build,branch:default:any,status:success/artifacts/children"
    let VersionPattern = /vvvv_gamma_(\d{4}\.\d)/;

    fetch(proxy+teamcity+builds)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            var href=data.querySelector('file content[href*="exe"]').getAttribute('href');
            var version=href.match(VersionPattern)[1]

            document.getElementById('previewButton').href = teamcity+href;
            document.getElementById('previewVersion').innerHTML += " " + version;
            document.getElementById('gammaDownloads').style = "visibility: visible";
        })
}