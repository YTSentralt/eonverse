document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch server information
    function fetchServerInfo() {
        const ip = "eonverse.club"; // Your server's IP

        fetch(`https://api.mcsrvstat.us/2/${ip}`)
            .then(response => response.json())
            .then(data => {
                const onlineCount = data.players ? data.players.online || 0 : 0;
                const ipElement = document.querySelector(".ip-address");
                const onlineCountElement = document.querySelector(".online-count");

                ipElement.textContent = ip;
                onlineCountElement.textContent = onlineCount;

                renderPayPalButton();
            })
            .catch(error => {
                console.error("Error fetching server information:", error);
                renderPayPalButton();
            });
    }

    // Function to render PayPal Smart Payment Buttons
    function renderPayPalButton() {
        paypal.Buttons({
            createOrder: function (data, actions) {
                // Set up the transaction
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '10.00' // Set the amount based on your pricing
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // Capture the funds from the transaction
                return actions.order.capture().then(function (details) {
                    // Handle a successful transaction
                    console.log('Transaction completed by ' + details.payer.name.given_name);
                    // Send purchase information to the backend
                    sendPurchaseInfo(details);
                });
            }
        }).render('#paypal-button-container');
    }

    // Function to send purchase information to the backend
    function sendPurchaseInfo(details) {
        const rankToBuy = "VIP"; // Change this to the purchased rank
        const purchaseData = { rankToBuy };

        // Send the purchase data to your backend server
        fetch('http://localhost:3000/api/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error making purchase. Please try again.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message); // Show success message
                } else {
                    throw new Error(data.message); // Show error message
                }
            })
            .catch(error => {
                console.error('Error sending purchase data:', error.message);
                alert('Error making purchase. Please try again.');
            });
    }

    // Fetch server information when the page loads
    fetchServerInfo();
});
