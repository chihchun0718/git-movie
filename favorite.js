const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovieList')) || []

const dataPanel = document.querySelector('#data-panel') //找出要render movie list的位置


//在這邊其實data = movies這個參數，但把它分開用不要連結再一起，所以不直接帶入movies使用
function renderMovieList(data) {
  let rawData = ''
  data.forEach((item) => {
    //需要電影中的title, image，這邊自己設定的item就是代表movies list中的每一個movie item
    rawData += `
          <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL}${item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id ="${item.id}" >More</button>
              <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`

  })
  dataPanel.innerHTML = rawData
}

//Show Movie Modal 功能
function showMovieModal(id) {
  //宣告要改的變數
  const movieTitle = document.querySelector('.modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieData = document.querySelector('#movie-modal-date')
  const movieDescripution = document.querySelector('#movie-modal-descripution')

  axios.get(INDEX_URL + id).then(response => {
    const dataInfo = response.data.results
    movieTitle.innerText = dataInfo.title
    movieData.innerText = `Released Date: ` + dataInfo.release_date
    movieDescripution.innerText = dataInfo.description
    movieImage.innerHTML =
      `<img src="${POSTER_URL}${dataInfo.image}" alt="" class="img-fluid">`
  })
}

renderMovieList(movies)

function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovieList', JSON.stringify(movies))
  renderMovieList(movies)
}


//listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})



// axios.get(INDEX_URL).then(response => {
//   // Array(80)
//   for (let movie of response.data.results) {
//     movies.push(movie)
//   }
//   // movies.push(...response.data.results) 也可以用這樣的方式來加入movies array
//   console.log(movies)
//   renderMovieList(movies)
// })

//監聽Search Bar的內容並執行搜尋動作
// searchform.addEventListener('submit', function searchKeyword(event) {
//   event.preventDefault();
//   const keyword = searchInput.value.trim().toLowerCase() //把關鍵字變成小寫
//   let filterList = []

//   if (!keyword.length) {
//     return alert('please type in a movie name')
//   }

//   //檢查movies(movie list)中的每一部電影有沒有包含你的keyword用for of loop 以及includes()功能 or 直接使用filiter()函式
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filterList.push(movie)
//   //   }
//   // }
//   // renderMovieList(filterList)

//   //使用filter的方式
//   filterList = movies.filter((movie) =>
//     movie.title.toLowerCase().includes(keyword)
//   )

//   //如果輸入後找不到
//   if (filterList.length === 0) {
//     return alert('cant find the keyword!')
//   }
//   renderMovieList(filterList)

// })

