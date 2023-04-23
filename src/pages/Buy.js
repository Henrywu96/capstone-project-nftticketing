import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast
} from "@chakra-ui/react";

function Buy({ connectedContract }) {
  const toast = useToast();
  const [totalTickets, setTotalTickets] = useState(null);
  const [availableTickets, setAvailableTickets] = useState(null);
  const [buyPending, setBuyPending] = useState(false);

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyPending(true);
      const buyTransaction = await connectedContract.mint({
        value: `${0.01 * 10 ** 18}`
      });

      await buyTransaction.wait();
      setBuyPending(false);

      toast({
        status: 'success',
        title: 'Sale is open',
        variant: 'subtile',
        description: 'Sale is open!'
      });

    } catch (err) {
      console.log(err);
      setBuyPending(false);
      toast({
        status: 'failure',
        title: 'Error',
        variant: 'subtile',
        description: err
      });
    }
  }

  const getAvailableTickets = async () => {
    try {
      const count = await connectedContract.availableTickets();
      setAvailableTickets(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  }

  const getTotalTicket = async () => {
    try {
      const count = await connectedContract.totalTickets();
      setTotalTickets(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  }

   useEffect(() => {
    if (!connectedContract) return;
    
    getTotalTicket();
    getAvailableTickets();
  });

  return (
    <>
      <Heading mb={4} mt={20}>
        NFT Ticketing Platform
      </Heading>
      <Text fontSize="xl" mb={4}>
        Connect your wallet to mint your
        NFT and get your ticket!
      </Text>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="0 auto"
        maxW="140px"
      >
        <ButtonGroup mb={4}>
          <Button
            onClick={buyTicket}
            loadingText="Pending"
            isLoading={buyPending}
            size="lg"
            colorScheme="teal"
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        {availableTickets && totalTickets && (
          <Text>
            {availableTickets} of {" "} {totalTickets} minted.
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
