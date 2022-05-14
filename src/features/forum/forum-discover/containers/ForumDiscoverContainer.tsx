import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getForumPostRequest } from '../ducks/actions'
import { selectedForumInterestCategoriesArraySelector } from 'features/select-forum-interests/ducks/selectors'
import ForumDiscover from '../components/ForumDiscover'

const mapStateToProps = (state: any) => ({
  selectedCategories: selectedForumInterestCategoriesArraySelector(state),
  forumPosts: state.forumDiscover.forumPosts,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getForumPost: (id: string) => dispatch(getForumPostRequest(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForumDiscover)
