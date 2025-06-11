document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    
    if (orderForm) {
      orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        placeOrderBtn.disabled = true;
        placeOrderBtn.querySelector('.btn-text').textContent = 'Processing...';
        
        try {
          const formData = new FormData(orderForm);
          const data = Object.fromEntries(formData.entries());
          
          // Add cart items and totals from the page
          data.items = JSON.parse(orderForm.querySelector('input[name="items"]').value);
          data.total = parseFloat(orderForm.querySelector('input[name="total"]').value);
          
          const response = await fetch('/orders/place-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          
          if (result.success) {
            window.location.href = `/orders/confirmation/${result.orderId}`;
          } else {
            alert(result.error || 'Failed to place order');
            placeOrderBtn.disabled = false;
            placeOrderBtn.querySelector('.btn-text').textContent = 'Place Order';
          }
        } catch (err) {
          console.error('Order submission error:', err);
          alert('An error occurred. Please try again.');
          placeOrderBtn.disabled = false;
          placeOrderBtn.querySelector('.btn-text').textContent = 'Place Order';
        }
      });
      
      // Update shipping cost when method changes
      document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', function() {
          const shippingCost = this.value === 'standard' ? 0 : 
                             this.value === 'express' ? 9.99 : 24.99;
                             
          document.querySelector('.shipping-cost').textContent = 
            shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
          
          // Recalculate total (you'll need to get subtotal and tax from your page)
          const subtotal = parseFloat(document.querySelector('input[name="total"]').value);
          const tax = subtotal * 0.08; // Adjust tax calculation as needed
          const total = subtotal + shippingCost + tax;
          
          document.querySelector('#cart-total').textContent = `$${total.toFixed(2)}`;
        });
      });
    }
  });