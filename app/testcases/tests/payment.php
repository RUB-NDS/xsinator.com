<script>

const applePayMethod = {
    supportedMethods: "https://apple.com/apple-pay",
    data: {
        version: 3,
        merchantIdentifier: "merchant.com.example",
        countryCode: "US",
        merchantCapabilities: ["supports3DS"],
        supportedNetworks: ["visa"],
    },
}
const methods = [{supportedMethods: "basic-card"}, applePayMethod]
const details = {
    total: {
        label: "Total",
        amount: {
            currency: "USD",
            value: "1.00",
        },
    },
}
const request1 = new PaymentRequest(methods, details)
</script>
<?php
if(isset($_GET['1'])){ ?>

    <script>
    request1.show()

    </script>

<?php }

echo "Ok";
