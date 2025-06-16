document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const mobileNav = document.querySelector(".mobile-nav");
    const closeMenu = document.querySelector(".close-menu");
    const body = document.body;
  
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener("click", () => {
        mobileNav.classList.add("active");
        body.style.overflow = "hidden";
      });
    }
  
    if (closeMenu) {
      closeMenu.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        body.style.overflow = "";
      });
    }
  
    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (
        mobileNav &&
        mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !hamburgerMenu.contains(e.target)
      ) {
        mobileNav.classList.remove("active");
        body.style.overflow = "";
      }
    });
  
    // Collection tabs functionality
    const tabBtns = document.querySelectorAll(".tab-btn");
    const collectionTabs = document.querySelectorAll(".collection-tab");
  
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
  
        // Remove active class from all buttons and tabs
        tabBtns.forEach((btn) => btn.classList.remove("active"));
        collectionTabs.forEach((tab) => tab.classList.remove("active"));
  
        // Add active class to clicked button and corresponding tab
        btn.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });
  
    // Search functionality animation
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");
  
    if (searchInput && searchBtn) {
      searchBtn.addEventListener("click", () => {
        if (searchInput.value.trim() !== "") {
          // Animate search button
          searchBtn.style.transform = "translateY(-50%) scale(0.9)";
          setTimeout(() => {
            searchBtn.style.transform = "translateY(-50%) scale(1)";
          }, 200);
  
          // Here you would normally handle the search submission
          console.log("Searching for:", searchInput.value);
        }
      });
  
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && searchInput.value.trim() !== "") {
          // Animate search button
          searchBtn.style.transform = "translateY(-50%) scale(0.9)";
          setTimeout(() => {
            searchBtn.style.transform = "translateY(-50%) scale(1)";
          }, 200);
  
          // Here you would normally handle the search submission
          console.log("Searching for:", searchInput.value);
        }
      });
    }

    // Cart animation
    const cartIcon = document.querySelector(".cart-icon");
    const cartCount = document.querySelector(".cart-count");
  
    // Auth dropdown functionality (for future implementation)
    const authIcon = document.querySelector(".auth-icons .icon-btn");
  
    if (authIcon) {
      authIcon.addEventListener("click", function (e) {
        e.preventDefault();
  
        // Toggle auth dropdown (to be implemented)
        console.log("Auth icon clicked - would show dropdown");
  
        // For demo purposes, show a simple animation
        this.style.transform = "scale(0.9)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 200);
      });
    }
    // Custom cursor
    const cursor = document.querySelector(".cursor");
  
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
  
    document.addEventListener("mousedown", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });
  
    document.addEventListener("mouseup", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
  
    // Elements that should enlarge the cursor
    const links = document.querySelectorAll("a, button, .btn, .product, .team-member");
  
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        cursor.style.width = "50px";
        cursor.style.height = "50px";
        cursor.style.backgroundColor = "rgba(255, 182, 193, 0.2)";
      });
  
      link.addEventListener("mouseleave", () => {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        cursor.style.backgroundColor = "rgba(255, 182, 193, 0.5)";
      });
    });
  
    // Page loader animation
    const loader = document.querySelector(".loader");
  
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }, 2000);
    }
  
    // Page transition animation
    const pageTransition = document.querySelector(".page-transition");
  
    if (pageTransition) {
      pageTransition.style.transform = "translateY(0)";
  
      setTimeout(() => {
        pageTransition.style.transform = "translateY(-100%)";
      }, 500);
    }

    // Handle navigation links properly
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
          // Only handle internal links that need special treatment
          if (this.getAttribute('href').startsWith('#') || 
              this.classList.contains('add-to-cart') || 
              this.closest('.mobile-nav')) {
            return;
          }
          
          e.preventDefault();
          const href = this.getAttribute('href');
          
          if (pageTransition) {
            pageTransition.style.transform = "translateY(0)";
            setTimeout(() => {
              window.location.href = href;
            }, 500);
          } else {
            window.location.href = href;
          }
        });
    });
  
    // Scroll reveal animation
    const revealElements = document.querySelectorAll(".reveal");
  
    function checkReveal() {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;
  
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
  
        if (elementTop < windowHeight - revealPoint) {
          element.classList.add("active");
        }
      });
    }
  
    // Initial check
    checkReveal();
  
    // Check on scroll
    window.addEventListener("scroll", checkReveal);
  
    // Testimonial slider
    const testimonials = document.querySelectorAll(".testimonial");
    const dots = document.querySelectorAll(".dot");
    let currentTestimonial = 0;
  
    function showTestimonial(index) {
      testimonials.forEach((testimonial) => {
        testimonial.classList.remove("active");
      });
  
      dots.forEach((dot) => {
        dot.classList.remove("active");
      });
  
      testimonials[index].classList.add("active");
      dots[index].classList.add("active");
      currentTestimonial = index;
    }
  
    // Add click event to dots
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showTestimonial(index);
        });
      });
  
      // Auto rotate testimonials
      setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
      }, 5000);
    }
  
    // Parallax effect for hero section
    const heroImage = document.querySelector(".hero-image");
    const circle = document.querySelector(".circle");
  
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
  
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
  
      if (circle) {
        circle.style.transform = `translateY(${scrollPosition * 0.05}px)`;
      }
    });
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
  
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
  
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      });
    });
  
    // Product image hover effect
    const products = document.querySelectorAll(".product");
  
    products.forEach((product) => {
      const productImg = product.querySelector(".product-img");
  
      if (productImg) {
        product.addEventListener("mouseenter", () => {
          productImg.style.transform = "scale(1.05)";
        });
  
        product.addEventListener("mouseleave", () => {
          productImg.style.transform = "scale(1)";
        });
      }
    });
  
    // Header scroll effect
    const header = document.querySelector("header");
    let lastScrollTop = 0;
  
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
  
      if (scrollTop > 100) {
        header.style.padding = "1rem 5%";
        header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.05)";
      } else {
        header.style.padding = "2rem 5%";
        header.style.boxShadow = "none";
      }
  
      if (scrollTop > lastScrollTop && scrollTop > 500) {
        // Scrolling down
        header.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        header.style.transform = "translateY(0)";
      }
  
      lastScrollTop = scrollTop;
    });
  
    // Text animation for headings
    const animateHeadings = document.querySelectorAll("h1, h2");
  
    animateHeadings.forEach((heading) => {
      const text = heading.textContent;
      heading.textContent = "";
  
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.textContent = text[i];
        span.style.opacity = "0";
        span.style.animation = `fadeIn 0.5s ease forwards ${i * 0.05}s`;
        heading.appendChild(span);
      }
    });
  
    // Newsletter form animation
    const newsletterForm = document.querySelector(".newsletter form");
  
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const input = this.querySelector("input");
        const button = this.querySelector("button");
  
        if (input.value.trim() !== "") {
          button.textContent = "Thank You!";
          button.style.backgroundColor = "var(--pink)";
          button.style.borderColor = "var(--pink)";
          button.style.color = "var(--white)";
  
          setTimeout(() => {
            input.value = "";
            button.textContent = "Subscribe";
            button.style.backgroundColor = "";
            button.style.borderColor = "";
            button.style.color = "";
          }, 3000);
        }
      });
    }

    // ====== ADD-TO-CART GLOBAL FUNCTIONALITY ======
    // Function to update cart counts globally
    async function updateCartCounts() {
        try {
            const response = await fetch('/cart/count');
            const data = await response.json();
            
            if (response.ok) {
                document.querySelectorAll('.cart-count').forEach(el => {
                    el.textContent = data.count;
                });
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.dataset.productId;
            const originalHTML = this.innerHTML;
            
            // Add loading animation
            this.innerHTML = '<div class="spinner"></div>';
            this.disabled = true;
            
            try {
                const response = await fetch('/cart/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: 1
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Update cart counts
                    await updateCartCounts();
                    
                    // Show success feedback
                    this.innerHTML = '✓ Added';
                    this.classList.add('added');
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('added');
                        this.disabled = false;
                    }, 2000);
                } else {
                    alert('Failed to add to cart: ' + (data.error || ''));
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('Network error. Please try again.');
                this.innerHTML = originalHTML;
                this.disabled = false;
            }
        });
    });

    // Initial cart count update
    updateCartCounts();
    
    // ====== END OF ADD-TO-CART FUNCTIONALITY ======
});

// Product search functionality
const productSearch = document.getElementById('product-search');
if (productSearch) {
    productSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const name = card.dataset.name;
            const description = card.dataset.description;
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Collection filtering
const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const collectionId = this.dataset.collection;
            const productCards = document.querySelectorAll('.product-card');
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (collectionId === 'all' || card.dataset.collection === collectionId) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const collectionTabs = document.querySelectorAll('.collection-tab');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            collectionTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding tab
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.add('active');
        });
    });
});

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitButtons = this.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = true;
            if (!button.querySelector('.spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                button.appendChild(spinner);
            }
        });
    });
});