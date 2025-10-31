import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoadingState from './components/ui/states/LoadingState';

const LazyHomeWrapper = lazy(() => import('./components/pages/HomeWrapper'));
const LazyBoardPage = lazy(() => import('./components/pages/BoardPage'));
const LazyCreatePage = lazy(
	() => import('./components/pages/CreateBoardWrapper')
);
function App() {
	return (
		<Router>
			<Toaster position='top-right' reverseOrder={false} />
			<Suspense fallback={<LoadingState header={undefined} />}>
				<Routes>
					<Route path='/' element={<LazyHomeWrapper />} />

					<Route path='/create' element={<LazyCreatePage />} />
					<Route path='/board/:boardId' element={<LazyBoardPage />} />

					<Route path='*' element={<div>404 Not Found</div>} />
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
