import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  getForumInterestCategoriesRequest,
  selectForumInterestCategory,
} from '../ducks/actions'
import ForumInterestCategories from '../components/ForumInterestCategories'

const mapStateToProps = (state: any) => {
  const {
    forumInterests: { categories, loading },
  } = state
  return {
    categories,
    loading,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getForumInterestCategories: () =>
    dispatch(getForumInterestCategoriesRequest()),
  selectForumInterestCategory: (id: string) =>
    dispatch(selectForumInterestCategory(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForumInterestCategories)
