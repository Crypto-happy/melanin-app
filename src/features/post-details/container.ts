import { shareExternalPostRequest } from './ducks/actions'
import { connect } from 'react-redux'
import PostDetails from './PostDetails'
import { Dispatch } from 'redux'
import {
  addCommentRequest,
  getPostByIdRequest,
  getPostCommentsRequest,
  likeCommentRequest,
  replyCommentRequest,
  sharePostRequest,
  deleteCommentRequest,
  updateCommentRequest,
} from 'features/post-details/ducks/actions'
import {
  authorSelector,
  commentsSelector,
  postSelector,
} from './ducks/selectors'
import {
  blockUserRequest,
  deletePostRequest,
  likePostRequest,
} from 'features/home/ducks/actions'

const mapStateToProps = (state: any, ownProps: any) => ({
  post: postSelector(state, ownProps),
  currentUser: state.auth.currentUser,
  author: authorSelector(state, ownProps),
  comments: commentsSelector(state, ownProps),
  pagination: state.postDetails.pagination,
  loading: state.postDetails.loading,
  deleteSuccess: state.postDetails.deleteSuccess,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostById: (id: string) => dispatch(getPostByIdRequest(id)),
  getPostComments: (postId: string, skip: number, limit: number) =>
    dispatch(getPostCommentsRequest(postId, skip, limit)),
  likePost: (id: string) => dispatch(likePostRequest(id)),
  sharePost: (id: string, text: string) => dispatch(sharePostRequest(id, text)),
  shareExternalPost: (id: string) => dispatch(shareExternalPostRequest(id)),
  addComment: (postId: string, text: string) =>
    dispatch(addCommentRequest(postId, text)),
  likeComment: (commentId: string) => dispatch(likeCommentRequest(commentId)),
  replyComment: (commentId: string, text: string) =>
    dispatch(replyCommentRequest(commentId, text)),
  deletePost: (id: string) => dispatch(deletePostRequest(id)),
  deleteComment: (id: string) => dispatch(deleteCommentRequest(id)),
  blockCommentOwner: (id: string) => dispatch(blockUserRequest(id)),
  updateComment: (commentId: string, text: string) =>
    dispatch(updateCommentRequest(commentId, text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails)
