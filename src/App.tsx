import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "@/app/store";
import { QueryProvider } from "@/app/providers/query/QueryProvider";
import { SnackbarProvider } from "@/shared/components/snackbar";
import { AppRouter } from "@/app/router";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import "./App.css";

function App() {
  const basename = window.location.hostname.endsWith(".github.io")
    ? "/sales-handy-assign"
    : "/";

  return (
    <StoreProvider>
      <QueryProvider>
        <BrowserRouter basename={basename}>
          <SnackbarProvider>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </SnackbarProvider>
        </BrowserRouter>
      </QueryProvider>
    </StoreProvider>
  );
}

export default App;
