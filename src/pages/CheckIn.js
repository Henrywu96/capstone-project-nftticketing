import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Text,
  Box
} from "@chakra-ui/react";
import QrReader from "react-qr-scanner";


function CheckIn({connectedContract}) {
  const [scanner, setScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [ownedTicket, setOwnedTicket] = useState(false);

  useEffect(() => {
    const confirmOwnership = async () => {
      try {
        if (!connectedContract) return;
        
        const confirm = await connectedContract.confirmOwnership(scannedAddress);
        setOwnedTicket(confirm);
        console.log(confirm);

      } catch (err) {
        console.log(err);
      }
    }

    if (scannedAddress) {
      confirmOwnership();
    }
  }, [connectedContract, scannedAddress]);

  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!scanner && scannedAddress && ownedTicket && (
        <>
          <Text fontSize="xl" mb={8}>
            This wallet account owns a NFT ticket.
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button size="lg" colorScheme="teal">
              Check In
            </Button>
          </Flex>
        </>
      )}
      {!scanner && (
        <>
          {!scannedAddress && (
            <Text fontSize="xl" mb={8}>
              Scan wallet address to verify
              ticket ownership and check-in.
            </Text>
          )}

          {scannedAddress && !ownedTicket && (
            <Text fontSize="xl" mb={8}>
              This wallet account does not own a NFT ticket.
            </Text>
          )}

          {!ownedTicket && (
            <Flex width="100%" justifyContent="center">
              <Button size="lg" colorScheme="teal" onClick={() => setScanner(true)}>
              Scan QR Code
            </Button>
          </Flex>
          )}
        </>
      )}

      {scanner && (
        <>
        <Box
          padding="0 18px"
          margin="18px auto 9px auto"
          width="360px"
        >
          <QrReader 
            style={{
              margin: "0 auto",
              maxWidth: "100%"
              }}
              onScan={(data) => {
                console.log(data);
              }}
              onError={(err) => {
                console.log(err);
              }}
          />
        </Box>
        <Flex
          width="100%"
          justifyContent="center"
        >
          <Button
            onClick={() => setScanner(false)}
            size="lg"
            colorScheme="red"
          >
            Cancel Scan
          </Button>
        </Flex>
      </>
      )}
    </>
  );
}

export default CheckIn;
