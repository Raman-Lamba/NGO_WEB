document
  .getElementById("payment-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Get user inputs
    const amount = document.getElementById("amount").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;

    const options = {
      key: "rzp_test_tfDjAbKfmG770g", // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // Amount is in currency subunits (e.g., for INR 500, amount should be "50000")
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      handler: async function (response) {
        // Display the payment ID on the web page
        document.getElementById("payment-id-display").innerText =
          "Payment successful! Payment ID: " + response.razorpay_payment_id;
        console.log(response);
        // Save payment details to Firebase
      },
      prefill: {
        name: name,
        email: email,
        contact: contact,
      },
      theme: {
        color: "#333333",
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open(); // Open the Razorpay payment modal
  });
