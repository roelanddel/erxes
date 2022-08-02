export default `
  type ForumCategory @key(fields: "_id") {
    _id: ID!
    name: String!
    parentId: ID

    parent: ForumCategory
    children: [ForumCategory!]
    descendants: [ForumCategory!]
    ancestors: [ForumCategory!]
  }
`;
