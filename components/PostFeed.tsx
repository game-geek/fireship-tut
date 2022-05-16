import Link from 'next/link'
import { FC } from 'react'
import { PostsType, PostType } from '../pages/[username]'

interface props {
    posts: PostsType
    admin: boolean
}

const PostFeed:FC<props> = ({ posts, admin }) => { // , admin 
    return (
        <>
            {posts && posts.map(post => <PostItem post={post} key={post.slug} admin={admin}/>)}
        </>
    )
}


function PostItem({ post, admin=false }: { post: PostType, admin?: boolean }) {
    // Naive method to calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length // .split converts an an array of a string, splitting on the desired character
    const minutesToRead = (wordCount / 100 + 1).toFixed(0) // rounds the number to specified numbers after the comma

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <a>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>
            <Link href={`/${post.username}/${post.slug}`}>
                <a>{post.title}</a>
            </Link>

            <footer>
                <span>
                    {wordCount} words.  {minutesToRead} min read
                </span> 
                <span>💗 {post.heartCount} Hearts</span>
            </footer>
        </div>
    )
}


export default PostFeed
