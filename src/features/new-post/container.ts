import { connect } from 'react-redux'
import NewPost from './NewPost'
import { Dispatch } from 'redux'
import {
  product_categories,
  submitPostRequest,
  updatePostRequest,
} from 'features/new-post/ducks/actions'

const mapStateToProps = (state: any) => {
  const { loading, success, error, p_categories } = state.newPost
  const currentUser = state.auth.currentUser
  return {
    loading,
    success,
    error,
    p_categories,
    currentUser,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProductCategories: () => dispatch(product_categories()),

  submitPost: (
    post: any,
    uploadProgressHandler: (event: ProgressEvent) => void,
  ) => dispatch(submitPostRequest(post, uploadProgressHandler)),
  updatePost: (
    post: any,
    uploadProgressHandler: (event: ProgressEvent) => void,
  ) => dispatch(updatePostRequest(post, uploadProgressHandler)),
})
export default connect(mapStateToProps, mapDispatchToProps)(NewPost)
