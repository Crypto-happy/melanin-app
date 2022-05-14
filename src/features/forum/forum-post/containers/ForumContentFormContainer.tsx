import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  createForumPostRequest,
  selectForumFormCategoryId,
} from '../ducks/actions'
import {
  getCategoryArraySelector,
  getSubCategoryArraySelector,
} from '../ducks/selectors'
import ForumContentForm from '../components/ForumContentForm'

const mapStateToProps = (state: any) => {
  const {
    entities: { categories, subCategories },
    forumForm: { loading },
  } = state
  return {
    categories: getCategoryArraySelector(state),
    subCategories: getSubCategoryArraySelector(state),
    categoryByIds: categories,
    subCategoryByIds: subCategories,
    loading,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectForumFormCategoryId: (id: string) =>
    dispatch(selectForumFormCategoryId(id)),
  createForumPost: (forumPost: any) =>
    dispatch(createForumPostRequest(forumPost)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForumContentForm)
