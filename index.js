import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const currentHandle = `@Scrimba`
const currentHandleImg = `images/scrimbalogo.png`
const deleteTweetModal = document.getElementById("delete-tweet-modal")
let delBtnTweetId = 0


document.addEventListener('click', function(e){

    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.id === "tweet-delete-btn"){
        delBtnTweetId = e.target.dataset.xbutton
        handleDelBtnClick()
    }
    else if (e.target.id === "modal-yes-btn"){
        removeTweet(delBtnTweetId)
    }
    else if (e.target.id === "modal-no-btn"){
        deleteTweetModal.style.display = "none"
        delBtnTweetId = 0       
    }
    else if (e.target.id === "reply-tweet-btn"){ 
        handleReplyTweetBtnClick(e)        
    }
       
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = getTargetTweet(tweetId)

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = getTargetTweet(tweetId)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: currentHandle,
            profilePic: currentHandleImg,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleDelBtnClick(tweetId){
    deleteTweetModal.style.display = "block"
}

function handleReplyTweetBtnClick(e){
    const replyText = e.target.parentElement.firstChild.value
    const tweetObj = getTargetTweet(e.target.dataset.replybtn)
    
    if (replyText){
        tweetObj.replies.unshift(
            {
                handle: currentHandle,
                profilePic: currentHandleImg,
                tweetText: replyText
            })
    }
    console.log(tweetObj.replies)
    render()
}

function getTargetTweet(tweetId){
    return tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `<div class="reply-tweet-box tweet-reply"><input id="reply-tweet-text" class="reply-tweet-text" type="text" data-replytext="${tweet.uuid}" placeholder="write your retply here"><button class="reply-tweet-btn" id="reply-tweet-btn" data-replybtn="${tweet.uuid}">reply</button></div>`
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
         
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="tweet-handle-container">
                 <p class="handle">${tweet.handle}</p>
                 ${getDeleteBtn(tweet)}
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function getDeleteBtn(tweet){
    if (tweet.handle === currentHandle){
        return `<i id="tweet-delete-btn" data-xbutton="${tweet.uuid}" class="fa-solid fa-xmark"></i>`
    } else {
        return ''
    }
}

function removeTweet(tweetId){
    let tweetIndex = tweetsData.indexOf(getTargetTweet(tweetId))
    tweetsData.splice(tweetIndex, 1)
    deleteTweetModal.style.display = "none"
    render()
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

