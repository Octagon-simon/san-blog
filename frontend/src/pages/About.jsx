import React from 'react'

export default function About() {

    return (
        <>
            <section>
                <div className='container mt-5 mb-5 p-3'>
                    <div className='has-text-centered'>
                        <h2 className="title is-1 about-title">ABOUT US</h2>
                        <h5 className="subtitle">Learn more about who we are</h5>
                    </div>
                    <section className="sis-section mt-5">
                        <article>
                            <h4 className='title is-4 mb-2'>Our Aim</h4>
                            <p className='mb-4'>We aim to become the biggest community for <strong>developers</strong> to blog and share great & helpful contents.</p>
                            <h4 className='title is-4 mb-2'>Our Goal</h4>
                            <p className='mb-4'>Our Goal is to equip <strong>developers and engineers</strong> with the right tools they need for their project.</p>
                            <h4 className='title is-4 mb-2'>Inspiration</h4>
                            <p className='mb-1'>This project is part of the <strong>#30 days coding challenge</strong> by Emmalex. </p>
                            <p className='mb-4'> <strong>SanBlog</strong> was developed with <strong>ReactJS, NodeJS, Express & MongoDB</strong>. It is the first project that stands to be my first fullstack app.</p>
                        </article>
                    </section>
                </div>
            </section>
        </>
    )
} 