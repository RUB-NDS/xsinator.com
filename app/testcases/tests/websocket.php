<script>
    const openWS = () => {
        let s = new WebSocket('wss://ws.xsinator.com')
        s.onopen = (e) => {
            console.log(e)
            s.send('Hi')
        }
        s.onerror = (e) => {
            console.error(e)
        }
    }
    
</script>


<?php

if(isset($_GET['1'])){ ?>
<script>
    openWS()
</script>
<?php 
} 
echo "Ok";
?>




