import React, { useState } from 'react'
import useFetch from '../handleFetch'
import SinglePost from './SinglePost'
import { useNavigate, useSearchParams } from 'react-router-dom'
function Posts() {
    const [searchParams, ,] = useSearchParams()
    //const { data, FetchGet } = useFetch()
    const [status, setStatus] = useState("not ready")
    const [data, setData] = useState(null)
    const [filter, setFilter] = useState({
        category: searchParams.get('category')?.replaceAll('-',' ') || '',
        search: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [numOfPages, setNumOfPages] = useState(1)
    const [pageNumbers, setPageNumbers] = useState(1)
    const [recordsPerPage] = useState(5)
    const indexOfLastRecord = currentPage * recordsPerPage
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

    const Pagination = ({ numOfPages, currentPage, setCurrentPage }) => {
        console.log(numOfPages, "FROM PAGINATION")
        console.log([...Array(numOfPages + 1).keys()].slice(1))
        const pageNumbers = [...Array(numOfPages + 1).keys()].slice(1)

        const nextPage = () => {
            if (currentPage !== numOfPages)
                setCurrentPage(currentPage + 1)
        }

        const prevPage = () => {
            if (currentPage !== 1)
                setCurrentPage(currentPage - 1)
        }
        return (
            <nav className="pagination is-centered mt-5">
                <ul className="pagination-list is-justify-content-center pagination-sm">
                    <li className="page-item" aria-label="First">
                        <a href="#" className="page-link pagination-link"><span aria-hidden="true">&lsaquo;&lsaquo;</span></a>
                    </li>
                    <li className="page-item" onClick={prevPage} aria-label="Previous">
                        <a href="#" className="page-link pagination-link"><span aria-hidden="true">&lsaquo;</span></a>
                    </li>
                    {
                        pageNumbers.map(pageNum => {
                            return (
                                <li key={pageNum} className="page-item">
                                    <a {...(!currentPage) ? 'disabled' : ''} href="#" className={`page-link pagination-link ${(currentPage === pageNum) ? 'is-current' : ''}`} onClick={() => setCurrentPage(pageNum)} >{pageNum}</a>
                                </li>
                            )
                        })
                    }
                    <li className="page-item" onClick={nextPage} aria-label="Next">
                        <a href="#" className="page-link pagination-link"><span aria-hidden="true">&rsaquo;</span></a>
                    </li>
                    <li className="page-item" aria-label="Last">
                        <a href="#" className="page-link pagination-link"><span aria-hidden="true">&rsaquo;&rsaquo;</span></a>
                    </li>
                </ul>
            </nav>
        )
    }
    //records to be diplayed on thecurrent page
    //const currentRecords = data.posts.slice(indexOfFirstRecord, indexOfLastRecord)
    //number of pages
    // const NumOfPages = Math.ceil(data.posts.length / recordsPerPage)
    // const pageNumbers = [...Array(NumOfPages + 1).keys()].slice(1)


    const navigate = useNavigate()
    //console.log(data, s)
    //FetchGet('import.meta.env.VITE_BACKEND_URL/posts')
    //const [data, setData] = useState()

    //const r = FetchGet('import.meta.env.VITE_BACKEND_URL/posts')

    React.useEffect(() => {
        let url = new URL(import.meta.env.VITE_BACKEND_URL+'/posts');
        url.searchParams.append('category', filter.category.replaceAll('-',' ') || '')
        url.searchParams.append('search', filter.search || '')
        fetch(url.href, {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setData(data)
                    setStatus("ready")
                    setNumOfPages(Math.ceil(data.posts.length / recordsPerPage))
                    setPageNumbers([...Array(numOfPages + 1).keys()].slice(1))

                    console.log(Math.ceil(data.posts.length / recordsPerPage), pageNumbers)
                } else {
                    setData(null)
                    setStatus("null")
                }
            })
            .catch(err => {
                console.log(err)
                setData(null)
                setStatus("failed")
            })
    }, [filter]);

    const handleReadPost = (title) => {
        console.log(title);
        navigate(`/post/${title.replaceAll(' ', '-')}`)
    }

    const blogCategories = ['Science and Technology', 'Entertainment', 'Sports', 'Self Development', 'Health', 'Inspiration', 'Other'];

    return (
        <>
            <div className="container blog-container mt-5 p-3 centered-elem">
                {(status === "ready" && data) ?
                    <><h4 className="title is-4 has-text-centered">All Posts</h4>
                        <div className="field mb-2 p-2 search-area">
                            <label>Search for a post</label>
                            <input className="input" type="text" placeholder="Search for a post" id="inp_filter" onChange={(e) => { setFilter({ search: e.target.value }) }} />
                        </div>
                        <div className="filter-area">
                            <div className="field" style={{ maxWidth: "300px", marginLeft: "auto" }}>
                                <label>Filter by</label>
                                <div className="select is-fullwidth">
                                    <select onChange={(e) => setFilter({ category: e.target.value })} id="select_blog_category" className="" defaultValue={filter.category}>
                                        <option value="">All Categories</option>
                                        {
                                            blogCategories.map((val, ind) => {
                                                return (
                                                    <option key={ind}>{val}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>

                    : (status === "not ready") ?
                        <p id="loader" className="has-text-centered"> <i className="fas fa-spinner fa-spin fa-5x has-text-app-primary"></i></p>
                        : (status === "failed") ?
                            <div className="has-text-centered p-4">
                                <p><i className="fas fa-times-circle fa-5x has-text-app-primary"></i></p>
                                <h4 className="title is-4 mt-4">Couldn't fetch Posts</h4>
                                <button onClick={() => { window.location.reload() }} className="button is-app-primary is-act">Try again</button>
                            </div>
                            :
                            <>
                                <div className="field mb-2 p-2 search-area">
                                    <label>Search for a post</label>
                                    <input className="input" type="text" placeholder="Search for a post" id="inp_filter" onChange={(e) => { setFilter({ search: e.target.value }) }} />
                                </div>
                                <div className="filter-area">
                                    <div className="field" style={{ maxWidth: "300px", marginLeft: "auto" }}>
                                        <label>Filter by</label>
                                        <div className="select is-fullwidth">
                                            <select onChange={(e) => setFilter({ category: e.target.value })} id="select_blog_category" className="" defaultValue={filter.category}>
                                                <option value="">All Categories</option>
                                                {
                                                    blogCategories.map((val, ind) => {
                                                        return (
                                                            <option key={ind}>{val}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="has-text-centered p-4">
                                    <p><i className="fas fa-exclamation-triangle fa-5x has-text-app-primary"></i></p>
                                    {
                                        (filter.category) ?
                                            <h4 className="title is-4 mt-4">There are no Posts within this category</h4>
                                            : (filter.category) ?
                                                <h4 className="title is-4 mt-4">Your search query did not return any posts</h4>
                                                :
                                                <h4 className="title is-4 mt-4">No Posts Yet</h4>
                                    }
                                    <a href='/new-post' className="button is-app-primary is-act">Create a new post</a>
                                </div>
                            </>
                }
                {(status === "ready" && data) &&
                    data.posts.slice(indexOfFirstRecord, indexOfLastRecord).map((val, ind) => {
                        const coverImage = (val.cover) ? JSON.parse(val.cover)?.secure_url : 'https://res.cloudinary.com/dxsxxso3a/image/upload/v1668527703/cld-sample-3.jpg';
                        return (
                            <section key={ind} className="single-post bg-color">
                                <div className="single-post-first">
                                    <img src={coverImage} />
                                </div>
                                <div className="single-post-last has-text-centered">
                                    <div className="single-post-content">
                                        <h2 className="title is-5">{val.title}</h2>
                                        <h5 className="subtitle has-text-centered">{val.subtitle}</h5>
                                        <article dangerouslySetInnerHTML={{ __html: val.content.substr(0, 200) + "..." }}></article>
                                    </div>
                                    <p className="single-post-comment"><strong>{val.comments.length}</strong> {(val.comments.length === 1) ? 'comment' : 'comments'}</p>
                                    <button className="button is-app-primary btn-act has-fa-icon" onClick={() => { handleReadPost(val.title) }}>Read post&nbsp;<i className="fas fa-arrow-right fa-sm"></i></button>
                                </div>
                            </section>
                        )

                    })
                }
                {
                    (status === 'ready' && data && numOfPages) &&
                    <>
                        {console.log(numOfPages, " fromstatus")}
                        <Pagination numOfPages={numOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </>

                }
            </div>
        </>
    )
}

export default Posts