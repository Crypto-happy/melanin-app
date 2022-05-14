import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { selectForumInterestSubCategory } from '../ducks/actions'
import { selectedForumInterestCategoriesSelector } from '../ducks/selectors'
import ForumInterestSubCategories from '../components/ForumInterestSubCategories'

const mapStateToProps = (state: any) => {
  const {
    forumInterests: { loading },
  } = state

  return {
    selectedCategories: selectedForumInterestCategoriesSelector(state),
    loading,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectForumInterestSubCategory: (id: string) =>
    dispatch(selectForumInterestSubCategory(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForumInterestSubCategories)
