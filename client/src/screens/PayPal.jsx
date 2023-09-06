import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPal = ({ children }) => {
  const clientId = "AaiOR0UuKrkTaDWKtlae81PRr3enX2RBcxrcpX39uHH2VJy1ntxfIu3LuU8wOgey8oHm4SzH3cwqM5N5";

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPal;
