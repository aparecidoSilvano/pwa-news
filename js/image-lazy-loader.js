document.addEventListener("DOMContentLoaded", function () {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {

        console.log(lazyImages);

        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src ? lazyImage.dataset.src : '/images/image-default.png';
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);

                    console.log(lazyImage.dataset);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {

        console.log("não tem o negócio de lazyload no navegador");
        // Possibly fall back to a more compatible method here
    }
});