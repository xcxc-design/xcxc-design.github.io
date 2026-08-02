(() => {
  "use strict";

  const products =
    Array.isArray(window.PRODUCTS)
      ? window.PRODUCTS
      : [];

  let activeProduct = null;
  let activeImageIndex = 0;
  let lastFocusedElement = null;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipePointerId = null;

  function formatSales(value) {
    const sales = Number(value) || 0;

    if (sales >= 1000) {
      return `${Math.floor(sales / 1000) * 1000}+`;
    }

    if (sales >= 100) {
      return `${Math.floor(sales / 100) * 100}+`;
    }

    if (sales >= 10) {
      return `${Math.floor(sales / 10) * 10}+`;
    }

    return String(sales);
  }

  function sortedProducts(list) {
    return [...list].sort(
      (a, b) =>
        (Number(b.sales) || 0) -
        (Number(a.sales) || 0)
    );
  }

  function productImage(product) {
    const firstImage =
      Array.isArray(product.images)
        ? product.images[0]
        : "";

    if (firstImage) {
      return `
        <img
          src="${firstImage}"
          alt="${product.name}"
          loading="lazy"
        >
      `;
    }

    return `
      <div class="portfolio-product-placeholder">
        <span>图片待替换</span>
      </div>
    `;
  }

  function productCard(product, index, showRank, showSalesLabel = true) {
    const rank =
      String(index + 1).padStart(2, "0");

    return `
      <button
        class="portfolio-product-card"
        type="button"
        data-product-id="${product.id}"
        aria-label="查看${product.name}详情"
      >
        <div class="portfolio-product-image">
          ${
            showRank
              ? `<div class="portfolio-product-rank">${rank}</div>`
              : ""
          }

          ${productImage(product)}
        </div>

        <div class="portfolio-product-info">

          <div class="portfolio-product-left">
            <h3 class="portfolio-product-name">
              ${product.name}
            </h3>

            <div class="portfolio-product-meta">
              ${product.category} · ${product.year}
            </div>
          </div>

          <div class="portfolio-product-sales">
            ${formatSales(product.sales)}${showSalesLabel ? " 销量" : ""}
          </div>

        </div>
      </button>
    `;
  }

  function attachCardEvents(container) {
    container
      .querySelectorAll(".portfolio-product-card")
      .forEach(card => {
        card.addEventListener("click", () => {
          const product =
            products.find(
              item =>
                item.id ===
                card.dataset.productId
            );

          if (product) {
            openModal(product, card);
          }
        });
      });
  }

  function renderFeaturedProducts() {
    const grid =
      document.getElementById(
        "featuredProductGrid"
      );

    const empty =
      document.getElementById(
        "featuredProductsEmpty"
      );

    if (!grid) return;

    const featured =
      sortedProducts(
        products.filter(
          product =>
            product.featured === true
        )
      ).slice(0, 4);

    const productCards =
      featured
        .map(
          (product, index) =>
            productCard(
              product,
              index,
              true,
              false
            )
        )
        .join("");

    const moreCard = `
      <a
        class="featured-more-card"
        href="custom.html"
        aria-label="查看更多定制类产品设计"
      >
        <span aria-hidden="true">…</span>
      </a>
    `;

    grid.innerHTML =
      productCards + moreCard;

    if (empty) {
      empty.hidden = true;
    }

    attachCardEvents(grid);
  }

  function renderCustomProducts(category) {
    const grid =
      document.getElementById(
        "customProductGrid"
      );

    const empty =
      document.getElementById(
        "customProductsEmpty"
      );

    if (!grid) return;

    const filtered =
      sortedProducts(
        products.filter(
          product =>
            product.category === category
        )
      );

    grid.innerHTML =
      filtered
        .map(
          (product, index) =>
            productCard(
              product,
              index,
              false
            )
        )
        .join("");

    if (empty) {
      empty.hidden =
        filtered.length !== 0;
    }

    attachCardEvents(grid);
  }

  function initFilters() {
    const buttons =
      [
        ...document.querySelectorAll(
          ".custom-filter-button"
        )
      ];

    if (!buttons.length) return;

    let activeCategory =
      buttons[0].dataset.category;

    renderCustomProducts(
      activeCategory
    );

    buttons.forEach(button => {
      button.addEventListener(
        "click",
        () => {
          activeCategory =
            button.dataset.category;

          buttons.forEach(item => {
            const isActive =
              item === button;

            item.classList.toggle(
              "active",
              isActive
            );

            item.setAttribute(
              "aria-selected",
              String(isActive)
            );
          });

          renderCustomProducts(
            activeCategory
          );
        }
      );
    });
  }

  function modalMarkup() {
    return `
      <div
        class="product-modal-layer"
        id="productModalLayer"
        hidden
      >
        <button
          class="product-modal-backdrop"
          id="productModalBackdrop"
          type="button"
          aria-label="关闭产品详情"
        ></button>

        <section
          class="product-modal"
          id="productModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalProductName"
        >

          <button
            class="product-modal-close"
            id="productModalClose"
            type="button"
            aria-label="关闭"
          >
            <span></span>
            <span></span>
          </button>

          <div class="modal-carousel">

            <div
              class="modal-slide"
              id="modalSlide"
              aria-label="产品图片，可左右滑动"
            ></div>

            <button
              class="modal-carousel-button previous"
              id="modalPrevious"
              type="button"
              aria-label="上一张图片"
            >
              ←
            </button>

            <button
              class="modal-carousel-button next"
              id="modalNext"
              type="button"
              aria-label="下一张图片"
            >
              →
            </button>

            <div
              class="modal-carousel-count"
              id="modalCarouselCount"
            ></div>

            <div
              class="modal-carousel-dots"
              id="modalCarouselDots"
            ></div>

          </div>

          <div class="product-modal-content">

            <h2
              class="product-modal-name"
              id="modalProductName"
            ></h2>

            <div
              class="product-modal-meta"
              id="modalProductMeta"
            ></div>

            <div class="product-modal-field">
              <div class="product-modal-label">
                商品货号
              </div>

              <div
                class="product-modal-value"
                id="modalSku"
              ></div>
            </div>

            <div class="product-modal-field concept">
              <div class="product-modal-label">
                设计理念
              </div>

              <p
                class="product-modal-concept"
                id="modalConcept"
              ></p>
            </div>

          </div>

        </section>
      </div>
    `;
  }

  function ensureModal() {
    if (
      document.getElementById(
        "productModalLayer"
      )
    ) {
      return;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      modalMarkup()
    );

    document
      .getElementById(
        "productModalClose"
      )
      .addEventListener(
        "click",
        closeModal
      );

    document
      .getElementById(
        "productModalBackdrop"
      )
      .addEventListener(
        "click",
        closeModal
      );

    document
      .getElementById(
        "modalPrevious"
      )
      .addEventListener(
        "click",
        previousImage
      );

    document
      .getElementById(
        "modalNext"
      )
      .addEventListener(
        "click",
        nextImage
      );

    const slide =
      document.getElementById(
        "modalSlide"
      );

    slide.addEventListener(
      "pointerdown",
      event => {
        if (
          event.pointerType === "mouse" &&
          event.button !== 0
        ) {
          return;
        }

        swipePointerId =
          event.pointerId;

        swipeStartX =
          event.clientX;

        swipeStartY =
          event.clientY;

        slide.setPointerCapture(
          event.pointerId
        );
      }
    );

    slide.addEventListener(
      "pointerup",
      event => {
        if (
          swipePointerId !==
          event.pointerId
        ) {
          return;
        }

        const moveX =
          event.clientX -
          swipeStartX;

        const moveY =
          event.clientY -
          swipeStartY;

        swipePointerId = null;

        if (
          Math.abs(moveX) >= 45 &&
          Math.abs(moveX) >
            Math.abs(moveY) * 1.15
        ) {
          if (moveX < 0) {
            nextImage();
          } else {
            previousImage();
          }
        }
      }
    );

    slide.addEventListener(
      "pointercancel",
      () => {
        swipePointerId = null;
      }
    );
  }

  function productImages(product) {
    const images =
      Array.isArray(product.images)
        ? product.images.slice(0, 3)
        : [];

    while (images.length < 3) {
      images.push("");
    }

    return images;
  }

  function renderModalImage() {
    if (!activeProduct) return;

    const images =
      productImages(activeProduct);

    const image =
      images[activeImageIndex];

    const slide =
      document.getElementById(
        "modalSlide"
      );

    if (image) {
      slide.innerHTML = `
        <img
          src="${image}"
          alt="${activeProduct.name}商品图${activeImageIndex + 1}"
          draggable="false"
        >
      `;
    } else {
      slide.innerHTML = `
        <div class="modal-image-placeholder">
          <span>商品图片待替换</span>
        </div>
      `;
    }

    document.getElementById(
      "modalCarouselCount"
    ).textContent =
      `${activeImageIndex + 1} / 3`;

    const dots =
      document.getElementById(
        "modalCarouselDots"
      );

    dots.innerHTML =
      images
        .map(
          (_, index) => `
            <button
              class="modal-carousel-dot ${
                index === activeImageIndex
                  ? "active"
                  : ""
              }"
              type="button"
              data-image-index="${index}"
              aria-label="查看第${index + 1}张图片"
            ></button>
          `
        )
        .join("");

    dots
      .querySelectorAll(
        ".modal-carousel-dot"
      )
      .forEach(dot => {
        dot.addEventListener(
          "click",
          () => {
            activeImageIndex =
              Number(
                dot.dataset.imageIndex
              );

            renderModalImage();
          }
        );
      });
  }

  function setModalOrigin(card) {
    const modal =
      document.getElementById(
        "productModal"
      );

    if (!card) {
      modal.style.setProperty(
        "--modal-shift-x",
        "0px"
      );

      modal.style.setProperty(
        "--modal-shift-y",
        "0px"
      );

      return;
    }

    const rect =
      card.getBoundingClientRect();

    const cardCenterX =
      rect.left +
      rect.width / 2;

    const cardCenterY =
      rect.top +
      rect.height / 2;

    const viewportCenterX =
      window.innerWidth / 2;

    const viewportCenterY =
      window.innerHeight / 2;

    modal.style.setProperty(
      "--modal-shift-x",
      `${cardCenterX - viewportCenterX}px`
    );

    modal.style.setProperty(
      "--modal-shift-y",
      `${cardCenterY - viewportCenterY}px`
    );
  }

  function openModal(product, card) {
    ensureModal();

    activeProduct = product;
    activeImageIndex = 0;
    lastFocusedElement =
      document.activeElement;

    document.getElementById(
      "modalProductName"
    ).textContent =
      product.name;

    document.getElementById(
      "modalProductMeta"
    ).textContent =
      `${product.year} · ${formatSales(product.sales)}${showSalesLabel ? " 销量" : ""}`;

    document.getElementById(
      "modalSku"
    ).textContent =
      product.sku || "暂未填写";

    document.getElementById(
      "modalConcept"
    ).textContent =
      product.concept || "暂未填写";

    renderModalImage();
    setModalOrigin(card);

    const layer =
      document.getElementById(
        "productModalLayer"
      );

    layer.hidden = false;

    requestAnimationFrame(() => {
      layer.classList.add("open");
    });

    document.body.classList.add(
      "modal-open"
    );

    document.getElementById(
      "productModalClose"
    ).focus();
  }

  function closeModal() {
    const layer =
      document.getElementById(
        "productModalLayer"
      );

    if (!layer) return;

    layer.classList.remove("open");

    document.body.classList.remove(
      "modal-open"
    );

    window.setTimeout(() => {
      layer.hidden = true;
      activeProduct = null;

      if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus ===
          "function"
      ) {
        lastFocusedElement.focus();
      }
    }, 300);
  }

  function previousImage() {
    if (!activeProduct) return;

    activeImageIndex =
      (
        activeImageIndex -
        1 +
        3
      ) %
      3;

    renderModalImage();
  }

  function nextImage() {
    if (!activeProduct) return;

    activeImageIndex =
      (
        activeImageIndex +
        1
      ) %
      3;

    renderModalImage();
  }

  document.addEventListener(
    "keydown",
    event => {
      const layer =
        document.getElementById(
          "productModalLayer"
        );

      if (
        !layer ||
        layer.hidden
      ) {
        return;
      }

      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    }
  );

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      renderFeaturedProducts();
      initFilters();
    }
  );
})();
