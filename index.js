const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const MOVIE_PER_PAGE = 12

const movies = []
let filterList = [] //把filtermovies拿出來變成global variables


const dataPanel = document.querySelector('#data-panel') //找出要render movie list的位置
const searchform = document.querySelector('#form-search') //找出search bar的監聽位置
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator') //分頁器



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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`

  })
  dataPanel.innerHTML = rawData
}

//把每一頁的12部電影render到頁面中
function renderPagenator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE) //Math.ceil() 無條件進位
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

// 計算每頁的電影編號是從幾到幾 （1）80部完整電影清單 (2)user search後的電影清單
function getMoviesByPage(page) {
  //page 1 ->movies 0 ~ 11
  //page 2 ->movies 12 ~ 23
  //page 3 ->,ovies 24~ 35
  //...
  const data = filterList.length ? filterList : movies //data = 如果filterList.length > 0就用它為data，反之則用movies作為data
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
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

//新增Modal Render功能  //新增加入收藏清單功能 
dataPanel.addEventListener('click', function oneModalclick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//user按下 + 就會add movie into favorite list
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovieList')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('this movie has been added in to list before!')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovieList', JSON.stringify(list))
}

//監聽切換頁數 要放在'呼叫電影清單'之前！不然會沒有反應
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  console.log(page)
  renderMovieList(getMoviesByPage(page))
})

//呼叫電影清單
axios.get(INDEX_URL).then(response => {
  // Array(80)
  for (let movie of response.data.results) {
    movies.push(movie)
  }
  // movies.push(...response.data.results) 也可以用這樣的方式來加入movies array
  //console.log(movies)
  renderPagenator(movies.length)
  renderMovieList(getMoviesByPage(1))
})

//監聽Search Bar的內容並執行搜尋動作
searchform.addEventListener('submit', function searchKeyword(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase() //把關鍵字變成小寫`

  if (!keyword.length) {
    return alert('please type in a movie name')
  }


  //檢查movies(movie list)中的每一部電影有沒有包含你的keyword用for of loop 以及includes()功能 or 直接使用filiter()函式
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filterList.push(movie)
  //   }
  // }
  // renderMovieList(filterList)

  //使用filter的方式
  filterList = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  //如果輸入後找不到
  if (filterList.length === 0) {
    return alert('cant find the keyword!')
  }
  renderPagenator(filterList.length) //搜尋後要依據filter的篩選方式再render一次分頁器
  renderMovieList(getMoviesByPage(1)) //從顯示第一頁開始

})
