import { useState , useEffect} from 'react'
import { useDebounce } from 'react-use'
import { Client } from "appwrite";
import Search from './components/search';
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method : 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


function App() {
const [searchTerm , setSearchTerm] = useState("");
const [dataBox, setDataBox]= useState('');
const [errorMessage, setErrorMessage] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [debounceTerm, useDebounceTerm ] = useState('')


useDebounce(() => useDebounceTerm(searchTerm), 750, [searchTerm])


const fetchMovies = async ( query ='') => {
  setIsLoading(true);
  setErrorMessage('');
  try {
    const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :  `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);

     if (!response.ok){
        throw new Error('failed to fetch movies'); 
      } 
      const data = await response.json();


      if(data.Response === false){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setDataBox([]);
        return
      }
      setDataBox(data.results)
    
      
 
  } 
catch (error) {
    console.error(`Fetching movies unsuccessful due to: ${error}`);
    setErrorMessage('Unable to fetch movies');
  }
  finally{
    setIsLoading(false)
  }
}

useEffect(()=>{fetchMovies(debounceTerm);}, 
[debounceTerm])

  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
         
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
           </header>
           <section className="all-movies">
           <h2 className='mt-[40px]'>All Movies</h2>

           {isLoading ? (
            <Spinner/>)
            : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p> )
          : (
            <ul>
              {dataBox.map((movie) =>(
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

           </section>
           </div>
     
    </main>
  )
}

export default App
