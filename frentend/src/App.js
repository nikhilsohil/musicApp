import React, { useEffect, lazy, Suspense } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './components/Home';
import Loader from './reuseable/components/Loader.js';
import Controler from './components/Controler';
import BottomNavbar from './components/BottomNavbar';
import SearchBar from './components/SearchBar';
import SideNavbar from './components/SideNavbar';
import { useDispatch } from 'react-redux';
import { fetchLikedSongs, fetchLikedArtists, getUserDetails } from './store/asyncAction.js';
import TopPlaylists from './components/TopPlaylists.js';
import TopSongs from './components/TopSongs.js';


const Login=lazy(()=>import('./components/Login.js'));
const Signup=lazy(()=>import('./components/Signup.js'))
const ForgotPassword=lazy(()=>import('./components/ForgotPassword.js'));
const Song = lazy(() => import('./components/Song.js'));
const Library = lazy(() => import('./components/Library.js'));
const Account= lazy(() => import('./components/Account.js'));
const Playlist = lazy(() => import('./components/Playlist.js'));
const Album = lazy(() => import('./components/Album.js'));
const Artist = lazy(() => import('./components/Artist.js'));
const Search = lazy(() => import('./components/Search.js'));


function App() {

  const { isLogin, user } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginSignUpRoute = location.pathname === '/login' || location.pathname === '/signup' ||location.pathname === '/resetpassword';


  useEffect(() => {
    if (isLogin) {

      dispatch(getUserDetails(user._id));
      dispatch(fetchLikedSongs(user._id));
      dispatch(fetchLikedArtists(user._id));

    }
  }, [isLogin]);

  return (
    <Container fluid className='vh-100 vw-100 p-0 d-flex flex-column bg-body-secondary'>
      {!isLoginSignUpRoute && (
        <Row className='m-0 w-100 border p-0 border-4 bg-body-secondary'>
          <Col xs={12} className='d-flex p-0 px-2 justify-content-center bg-body-secondary align-items-center'>
            <SearchBar />
          </Col>
        </Row>
      )}

      <Row className='m-0 w-100 flex-grow-1 ' style={{ height: "74vh" }}>
        {!isLoginSignUpRoute && (
          <Col className='h-100 p-0 d-none d-md-block'>
            <SideNavbar />
          </Col>
        )}

        <Col md={isLoginSignUpRoute ? 12 : 10} className='h-100 p-0 '>
          <Suspense fallback={<Loader />}>
            <Routes>

              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/resetpassword' element={<ForgotPassword />} />
              <Route path='/topplaylists' element={<TopPlaylists/>} />
              <Route path='/topsongs/' element={<TopSongs />} />
              <Route path='/song/:songId' element={<Song />} />
              <Route path='/playlist/:type/:playListId' element={<Playlist />} />
              <Route path='/artist/:artistId' element={<Artist />} />
              <Route path='/album/:albumId' element={<Album />} />
              <Route path='/search/:type/:query' element={<><Search/></>} />
              <Route path='/myaccount' element={<Account />} />
              <Route path='/library' element={<Library />} />
              <Route path='*' element={<p>page not found</p>} />
            </Routes>
          </Suspense>
        </Col>
      </Row>

      {!isLoginSignUpRoute && (
        <>
          <Row className="w-100 m-0"> {/* Visible only on small devices */}
            <Col className="p-0">
              <Controler />
            </Col>
          </Row>

          <Row className="d-md-none w-100 m-0"> {/* Visible only on small devices */}
            <Col className="p-0">
              <BottomNavbar />
            </Col>
          </Row>

        </>
      )}
    </Container>
  );
}

export default App;
