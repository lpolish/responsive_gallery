(function () {
  let currentPage = 1;
  let totalPages = 1;
  let isLoading = false;
  let numImages;

  function throttle(callback, delay) {
    let timeoutId = null;
    let lastExecutedTime = 0;

    return function (...args) {
      const elapsedTime = Date.now() - lastExecutedTime;

      const runImmediately = elapsedTime > delay;

      if (runImmediately) {
        callback(...args);
        lastExecutedTime = Date.now();
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(...args);
          lastExecutedTime = Date.now();
        }, delay - elapsedTime);
      }
    };
  }

  function handleScroll() {
    if (isLoading) {
      return;
    }

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= scrollHeight) {
      if (currentPage >= totalPages) {
        return;
      }

      currentPage++;
      isLoading = true;
      loadImages(currentPage, numImages);
    }
  }

  function createImageElement(image) {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.classList.add('gallery-image');
    img.addEventListener('click', () => {
      const lightbox = document.getElementById('lightbox');
      const lightboxImage = document.getElementById('lightbox-image');
      lightboxImage.src = img.src;
      lightbox.classList.remove('hidden');
    });
    return img;
  }

  function loadImages(page, limit) {
    isLoading = true;
    fetch(`/api/images/${page}/${limit}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        totalPages = data.totalPages;
        const imageContainer = document.getElementById('image-container');

        data.images.forEach((image) => {
          const img = createImageElement(image);
          imageContainer.appendChild(img);
        });

        currentPage++;
        isLoading = false;
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }

  function handleCloseButton() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
  }

  function initialize() {
    const windowWidth = window.innerWidth;
    numImages = 16;
    loadImages(currentPage, numImages);
    numImages = 8;
    window.addEventListener('scroll', throttle(handleScroll, 200));
    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', handleCloseButton);
  }

  initialize();
})();
