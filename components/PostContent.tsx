import Link from 'next/link'
import { FC } from 'react'
// npm i react-markdown
import ReactMarkdown from "react-markdown"
import { PostType } from '../pages/[username]'

interface props {
    post: PostType
}

// UI COmponent for main post content
const PostContext:FC<props> = ({ post }) => {
    const createdAt = new Date(post.createdAt)

  return (
    <div className='card'>
        <h1>{post?.title}</h1>
        <span className="text-sm">
            Written By{' '}
            <Link href={`/{post.username}/`}>
                <a className='text-info'>@{post.username}</a>
            </Link>{' '}
            on {createdAt.toISOString()}
        </span>
        
        <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  )
}

export default PostContext