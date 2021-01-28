import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProvideAuth } from "./hooks/auth.hook";
import { NavBar, ProtectedRoute, NestedRoutes, Loader } from "./components";
import { ModalProvider } from "./hooks";
import { ErrorBoundary } from "./components/ErrorBoundery";
import { lazy, Suspense } from "react";
const Exam = lazy(() => import('./views/Exam'));
const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));
const Questions = lazy(() => import('./views/Questions'));
const Reports = lazy(() => import('./views/Reports'));
const Restore = lazy(() => import('./views/Restore'));
const Tests = lazy(() => import('./views/Tests'));

const App: React.FC = () => {
    return (
        <ModalProvider>
            <BrowserRouter>
                <ProvideAuth>
                    <NavBar />
                    <main className="app">
                        <ErrorBoundary>
                            <Suspense fallback={<Loader />}>
                                <Switch>
                                    <Route path={["/login", "/signup"]} component={Login} />
                                    <Route path="/reset/:token?" component={Restore} />
                                    <Route path="/exam/:testId" component={Exam} />
                                    <ProtectedRoute setsField path="/:organizationId/:fieldId">
                                        <NestedRoutes>
                                            <ProtectedRoute requiresField path="/questions" component={Questions} />
                                            <ProtectedRoute requiresField path="/tests" component={Tests} />
                                            <ProtectedRoute requiresField path="/reports" component={Reports} />
                                        </NestedRoutes>
                                    </ProtectedRoute>
                                    <ProtectedRoute path="/" component={Home} />
                                </Switch>
                            </Suspense>
                        </ErrorBoundary>
                    </main>
                </ProvideAuth>
            </BrowserRouter>
        </ModalProvider>
    );
};

export default App;
