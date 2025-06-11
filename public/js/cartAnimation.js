
document.addEventListener("DOMContentLoaded", () => {
    // Animation for quantity buttons
    const quantityButtons = document.querySelectorAll(".quantity-btn")
    quantityButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.1)"
      })
      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)"
      })
      button.addEventListener("mousedown", () => {
        button.style.transform = "scale(0.95)"
      })
      button.addEventListener("mouseup", () => {
        button.style.transform = "scale(1.1)"
      })
    })
  
    // Animation for remove buttons
    const removeButtons = document.querySelectorAll(".remove-item")
    removeButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.color = "var(--danger)"
        button.style.transform = "scale(1.2) rotate(90deg)"
      })
      button.addEventListener("mouseleave", () => {
        button.style.color = "var(--medium-gray)"
        button.style.transform = "scale(1) rotate(0deg)"
      })
    })
  
    // Animation for cart items
    const cartItems = document.querySelectorAll(".cart-item")
    cartItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "var(--off-white)"
      })
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = ""
      })
    })
  
    // Animation for the place order button
    const orderButton = document.querySelector(".cart-actions .btn")
    if (orderButton) {
      orderButton.addEventListener("mouseenter", () => {
        orderButton.style.backgroundColor = "var(--pink-dark)"
      })
      orderButton.addEventListener("mouseleave", () => {
        orderButton.style.backgroundColor = "var(--pink)"
      })
      orderButton.addEventListener("mousedown", () => {
        orderButton.style.transform = "scale(0.98)"
      })
      orderButton.addEventListener("mouseup", () => {
        orderButton.style.transform = "scale(1)"
      })
    }
  
    // Animation for continue shopping button
    const continueButton = document.querySelector(".cart-actions .btn-outline")
    if (continueButton) {
      continueButton.addEventListener("mouseenter", () => {
        continueButton.style.backgroundColor = "var(--black)"
        continueButton.style.color = "var(--white)"
      })
      continueButton.addEventListener("mouseleave", () => {
        continueButton.style.backgroundColor = "transparent"
        continueButton.style.color = "var(--black)"
      })
    }
  
    // Floating animation for empty cart image
    const emptyCartImage = document.querySelector(".empty-cart-image")
    if (emptyCartImage) {
      let direction = 1
      let position = 0
      setInterval(() => {
        position += 0.2 * direction
        if (position > 5 || position < -5) direction *= -1
        emptyCartImage.style.transform = `translateY(${position}px)`
      }, 50)
    }
  
    // Custom cursor effect
    // const cursor = document.querySelector(".cursor")
    // const cartElements = document.querySelectorAll(".cart-item, .quantity-btn, .remove-item, .btn, .btn-outline")
    // if (cursor) {
    //   cartElements.forEach((element) => {
    //     element.addEventListener("mouseenter", () => {
    //       cursor.style.width = "50px"
    //       cursor.style.height = "50px"
    //       cursor.style.backgroundColor = "rgba(255, 182, 193, 0.2)"
    //     })
    //     element.addEventListener("mouseleave", () => {
    //       cursor.style.width = "20px"
    //       cursor.style.height = "20px"
    //       cursor.style.backgroundColor = "rgba(255, 182, 193, 0.5)"
    //     })
    //   })
    // }
  
    // Fade-in animation
    const fadeElements = document.querySelectorAll(".fade-in")
    fadeElements.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      let delay = 0
      if (element.classList.contains("delay-1")) delay = 300
      else if (element.classList.contains("delay-2")) delay = 600
      else if (element.classList.contains("delay-3")) delay = 900
      setTimeout(() => {
        element.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, delay)
    })
  
    // Pulse effect for price elements
    const priceElements = document.querySelectorAll(".cart-item-price, .cart-item-total, #cart-subtotal, #cart-total")
    priceElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        element.style.transform = "scale(1.05)"
        element.style.color = "var(--pink-dark)"
      })
      element.addEventListener("mouseleave", () => {
        element.style.transform = "scale(1)"
        element.style.color = ""
      })
    })
  
    // Hover effect for cart summary
    const cartSummary = document.querySelector(".cart-summary")
    if (cartSummary) {
      cartSummary.addEventListener("mouseenter", () => {
        cartSummary.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
      })
      cartSummary.addEventListener("mouseleave", () => {
        cartSummary.style.boxShadow = "none"
      })
    }
  
    // Page transition effect
    const pageTransition = document.querySelector(".page-transition")
    if (pageTransition) {
      pageTransition.style.transform = "translateY(0)"
      setTimeout(() => {
        pageTransition.style.transform = "translateY(-100%)"
      }, 500)
    }
  })

  document.addEventListener('DOMContentLoaded', () => {
    // Quantity Update Handler
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.productId;
        const action = e.target.classList.contains('increment') ? 'increase' : 'decrease';
        const quantityElement = e.target.parentElement.querySelector('.quantity-display');
        const itemTotalElement = e.target.closest('.cart-item').querySelector('.total-value');
        
        try {
          // Add loading state
          const originalHTML = e.target.innerHTML;
          e.target.innerHTML = '<div class="spinner"></div>';
          e.target.disabled = true;
  
          const response = await fetch('/cart/update-quantity', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, action }),
          });
  
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Update quantity display
            quantityElement.textContent = data.newQuantity;
            
            // Update item total
            itemTotalElement.textContent = `₦${data.itemTotal}`;
            
            // Update cart totals
            document.getElementById('cart-subtotal').textContent = `₦${data.cartTotal}`;
            document.getElementById('cart-total').textContent = `₦${data.cartTotal}`;
            
            // Update all cart count elements
            document.querySelectorAll('.cart-count').forEach(element => {
              element.textContent = data.cartCount;
            });
  
            // Remove item row if quantity is 0
            if (data.removed) {
              e.target.closest('.cart-item').remove();
            }
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          // Reset button state
          e.target.disabled = false;
          e.target.innerHTML = originalHTML;
        }
      });
    });
  
    // Remove Item Handler
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.productId;
        const cartItem = e.target.closest('.cart-item');
  
        try {
          // Add loading state
          e.target.disabled = true;
          e.target.innerHTML = '<div class="spinner"></div>';
  
          const response = await fetch('/cart/remove-item', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          });
  
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Remove item from UI
            cartItem.remove();
            
            // Update cart totals
            document.getElementById('cart-subtotal').textContent = `₦${data.cartTotal}`;
            document.getElementById('cart-total').textContent = `₦${data.cartTotal}`;
            
            // Update cart count in header
            document.querySelector('.cart-count').textContent = data.cartCount;
          } else {
            console.error('Removal failed:', data.error);
          }
        } catch (error) {
          console.error('Network error:', error);
        } finally {
          // Reset button state even if request failed
          e.target.disabled = false;
          e.target.innerHTML = '&times;';
        }
      });
    });
  });

  