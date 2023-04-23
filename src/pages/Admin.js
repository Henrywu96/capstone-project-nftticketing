import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Text,
  useToast
} from "@chakra-ui/react";


function Admin({
  connectedContract
}) {

  const [salePending, setSalePending] = useState(false);
  const [closeSalePending, setCloseSalePending] = useState(false);
  const toast = useToast();

  const sale = async () => {
    try {
      if (!connectedContract) return;

      setSalePending(true);
      let saleTransaction = await connectedContract.sale();

      // Wait transaction to be resolved
      await saleTransaction.wait();
      // Once transaction is successful, pending is set to false
      setSalePending(false);

      // success toast
      toast({
        status: 'success',
        title: 'Sale is open',
        variant: 'subtile',
        description: 'Sale is open!'
      });

    } catch (err) {
      console.log(err);
      setSalePending(false);

      toast({
        status: 'failure',
        title: 'Error',
        variant: 'subtile',
        description: err
      });
    }
  };

  const closeSale = async () => {
    try {
      if (!connectedContract) return;

      setCloseSalePending(true);
      let closeSaleTransaction = await connectedContract.closeSale();

      await closeSaleTransaction.wait();
      setCloseSalePending(false);

      // close toast
      toast({
        status: 'success',
        title: 'Sale is closed',
        variant: 'subtile',
        description: 'Sale is closed!'
      });

    } catch (err) {
      console.log(err);
      setCloseSalePending(false);

      toast({
        status: 'failure',
        title: 'Error',
        variant: 'subtile',
        description: err
      });
    }
  }

  return (
    <>
      <Heading mb={4}>
        Admin Area
      </Heading>
      <Text fontSize="xl" mb={8}>
        Enable and disable sales on the
        smart contract.
      </Text>
      <Flex
        width="100%"
        justifyContent="center"
      >
        <Button
          onClick={sale}
          isLoading={salePending}
          isDisabled={closeSalePending}
          size="lg"
          colorScheme="teal"
        >
          Open Sale
        </Button>
        <Button
          onClick={closeSale}
          isLoading={closeSalePending}
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
