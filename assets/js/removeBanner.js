window.onload = () => {
    var selector = '[alt="www.000webhost.com"]';
    if (document.querySelector(selector) != null) {
        let bannerNode = document.querySelector(selector).parentNode.parentNode;
        bannerNode.parentNode.removeChild(bannerNode);
    }
}