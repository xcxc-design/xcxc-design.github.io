(() => {
  "use strict";

  const products =
    Array.isArray(window.PRODUCTS)
      ? window.PRODUCTS
      : [];

  let activeProduct = null;
  let activeImageIndex = 0;
  let lastFocusedElement = null;

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

  function productCard(product, index, showRank) {
    const rank = String(index + 1).padStart(2, "0");

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
            ${formatSales(product.sales)} 销量
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
                item.id === card.dataset.productId
            );

          if (product) {
            openDrawer(product);
          }
        });
      });
  }

  function renderFeaturedProducts() {
    const grid =
      document.getElementById("featuredProductGrid");

    const empty =
      document.getElementById("featuredProductsEmpty");

    if (!grid) return;

    const featured =
      sortedProducts(
        products.filter(
          product =>
            product.featured === true
        )
      ).slice(0, 8);

    grid.innerHTML =
      featured
        .map(
          (product, index) =>
            productCard(
              product,
              index,
              true
            )
        )
        .join("");

    if (empty) {
      empty.hidden =
        featured.length !== 0;
    }

    attachCardEvents(grid);
  }

  function renderCustomProducts(category) {
    const grid =
      document.getElementById("customProductGrid");

    const empty =
      document.getElementById("customProductsEmpty");

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

  function drawerMarkup() {
    return `
      <div
        class="product-drawer-layer"
        id="productDrawerLayer"
        hidden
      >
        <button
          class="product-drawer-backdrop"
          id="productDrawerBackdrop"
          type="button"
          aria-label="关闭产品详情"
        ></button>

        <aside
          class="product-drawer"
          id="productDrawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawerProductName"
        >

          <button
            class="product-drawer-close"
            id="productDrawerClose"
            type="button"
            aria-label="关闭"
          >
            <span></span>
            <span></span>
          </button>

          <div class="drawer-carousel">

            <div
              class="drawer-slide"
              id="drawerSlide"
            ></div>

            <button
              class="drawer-carousel-button previous"
              id="drawerPrevious"
              type="button"
              aria-label="上一张图片"
            >
              ←
            </button>

            <button
              class="drawer-carousel-button next"
              id="drawerNext"
              type="button"
              aria-label="下一张图片"
            >
              →
            </button>

            <div
              class="drawer-carousel-count"
              id="drawerCarouselCount"
            ></div>

            <div
              class="drawer-carousel-dots"
              id="drawerCarouselDots"
            ></div>

          </div>

          <div class="product-drawer-content">

            <h2
              class="product-drawer-name"
              id="drawerProductName"
            ></h2>

            <div class="product-drawer-field">
              <div class="product-drawer-label">
                商品货号
              </div>
              <div
                class="product-drawer-value"
                id="drawerSku"
              ></div>
            </div>

            <div class="product-drawer-field concept">
              <div class="product-drawer-label">
                设计理念
              </div>
              <p
                class="product-drawer-concept"
                id="drawerConcept"
              ></p>
            </div>

          </div>

        </aside>
      </div>
    `;
  }

  function ensureDrawer() {
    if (
      document.getElementById(
        "productDrawerLayer"
      )
    ) {
      return;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      drawerMarkup()
    );

    document
      .getElementById(
        "productDrawerClose"
      )
      .addEventListener(
        "click",
        closeDrawer
      );

    document
      .getElementById(
        "productDrawerBackdrop"
      )
      .addEventListener(
        "click",
        closeDrawer
      );

    document
      .getElementById(
        "drawerPrevious"
      )
      .addEventListener(
        "click",
        previousImage
      );

    document
      .getElementById(
        "drawerNext"
      )
      .addEventListener(
        "click",
        nextImage
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

  function renderDrawerImage() {
    if (!activeProduct) return;

    const images =
      productImages(activeProduct);

    const image =
      images[activeImageIndex];

    const slide =
      document.getElementById(
        "drawerSlide"
      );

    if (image) {
      slide.innerHTML = `
        <img
          src="${image}"
          alt="${activeProduct.name}商品图${activeImageIndex + 1}"
        >
      `;
    } else {
      slide.innerHTML = `
        <div class="drawer-image-placeholder">
          <span>商品图片待替换</span>
        </div>
      `;
    }

    document.getElementById(
      "drawerCarouselCount"
    ).textContent =
      `${activeImageIndex + 1} / 3`;

    const dots =
      document.getElementById(
        "drawerCarouselDots"
      );

    dots.innerHTML =
      images
        .map(
          (_, index) => `
            <button
              class="drawer-carousel-dot ${
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
        ".drawer-carousel-dot"
      )
      .forEach(dot => {
        dot.addEventListener(
          "click",
          () => {
            activeImageIndex =
              Number(
                dot.dataset.imageIndex
              );

            renderDrawerImage();
          }
        );
      });
  }

  function openDrawer(product) {
    ensureDrawer();

    activeProduct = product;
    activeImageIndex = 0;
    lastFocusedElement =
      document.activeElement;

    document.getElementById(
      "drawerProductName"
    ).textContent =
      product.name;

    document.getElementById(
      "drawerSku"
    ).textContent =
      product.sku || "暂未填写";

    document.getElementById(
      "drawerConcept"
    ).textContent =
      product.concept || "暂未填写";

    renderDrawerImage();

    const layer =
      document.getElementById(
        "productDrawerLayer"
      );

    layer.hidden = false;

    requestAnimationFrame(() => {
      layer.classList.add("open");
    });

    document.body.classList.add(
      "drawer-open"
    );

    document.getElementById(
      "productDrawerClose"
    ).focus();
  }

  function closeDrawer() {
    const layer =
      document.getElementById(
        "productDrawerLayer"
      );

    if (!layer) return;

    layer.classList.remove("open");

    document.body.classList.remove(
      "drawer-open"
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
    }, 320);
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

    renderDrawerImage();
  }

  function nextImage() {
    if (!activeProduct) return;

    activeImageIndex =
      (
        activeImageIndex +
        1
      ) %
      3;

    renderDrawerImage();
  }

  document.addEventListener(
    "keydown",
    event => {
      const layer =
        document.getElementById(
          "productDrawerLayer"
        );

      if (
        !layer ||
        layer.hidden
      ) {
        return;
      }

      if (event.key === "Escape") {
        closeDrawer();
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
