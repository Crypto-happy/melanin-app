import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getForumPostRequest } from '../ducks/actions'
import ForumCategoryDiscover from '../components/ForumCategoryDiscover'

const mapStateToProps = (state: any) => ({
  forumPosts: state.forumDiscover.forumPosts,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getForumPost: (id: string) => dispatch(getForumPostRequest(id)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForumCategoryDiscover)
