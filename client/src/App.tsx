import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import BoardPage from './components/pages/BoardPage';
import CreateBoardWrapper from './components/pages/CreateBoardWrapper';
import HomeWrapper from './components/pages/HomeWrapper';

function App() {
	return (
		<Router>
			<Toaster position='top-right' reverseOrder={false} />
			<Routes>
				<Route path='/' element={<HomeWrapper />} />

				<Route path='/create' element={<CreateBoardWrapper />} />
				<Route path='/board/:boardId' element={<BoardPage />} />

				<Route path='*' element={<div>404 Not Found</div>} />
			</Routes>
		</Router>
	);
}

export default App;
