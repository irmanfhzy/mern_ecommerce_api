import AuthProvider from "./AuthProvider";
import CartProvider from "./CartProvider";
import SearchProvider from "./SearchProvider";
import AppSettingProvider from "./AppSettingProvider";
import ConfirmationDialogProvider from "./ConfirmationDialogProvider";

export default function Providers({ children }) {
  return (
    <ConfirmationDialogProvider>
      <AuthProvider>
        <AppSettingProvider>
          <CartProvider>
            <SearchProvider>{children}</SearchProvider>
          </CartProvider>
        </AppSettingProvider>
      </AuthProvider>
    </ConfirmationDialogProvider>
  );
}
