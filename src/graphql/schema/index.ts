const { buildSchema } = require("graphql");
const schema = buildSchema(`#graphql
schema {
	query: Query
	mutation: Mutation
}

type Query{
	# Auth related queries
	login(data:loginParam):loginData! # check

	# User related queries  
	getUsers(page: Int,per_page: Int,query: String): users! # check
	getUser(id:String!): user! # check
	getCurrentUser: user! # check
	getUserByUsername(username:String!): user! #check
	getUserByEmail(email:String!): user! #check

	# Channel related queries  
	getChannels(page: Int,per_page: Int,query: String): channels! #check
	getChannel(id:String!): channel! #check
	getChannelByName(name:String!): channel! # check
	getUserChannels(id:String): [channel]! # check

	# Message related queries  
	getChannelMessages(id:String): messages! #check
	# getDirectMessages(user_one_id:String!,user_two_id:String!): messages! # after
}

type Mutation{
	createUser(data:userParam!): user! # check
	signup(data:signupParam!):user! # check
	updateUser(id:String!,data:userParam!):user! # check
	deleteUser(id:String!):Boolean! # check

	createChannel(data:channelParam!): channel! #check
	addMember(id:String!,user_id:String!):channel! # check
	updateChannel(id:String!,data:channelUpdateParam!): channel! # check
	deleteChannel(id:String):Boolean! #check

	sendMessage(receiver:receiver!,message:String!):message! #check
}

type loginData{
	user:user!
	token:String!
}

type messages{
	list:[message!]
	count: Int!
	page: Int!
	per_page: Int!
}

type message{
	id: String!
	sender: mUser!
	message: String!
	receiver_type: ReceiverType!
	receiver_id: String!
}

type mUser{
	id:String!
	avatar:String
	displayName:String!
}

type channels{
	list:[channel!]
	count: Int!
	page: Int!
	per_page: Int!
}

type channel{
	id: String!
	name: String!
	creator: user!
	description: String
	members:[member!]
	displayName:String!
	image: String
}

type member{
	id: String!
	displayName: String!
	avatar: String
}

type users {
	list:[user!]
	count: Int!
	page: Int!
	per_page: Int!
}

type user {
	id: String!
	username: String!
	email: String!
	avatar: String
	age: Int!
	phone: String
	firstname: String!
	lastname: String!
	displayName: String!
	bio: String
	type: UserType
}

input receiver{
	id:String!
	type:ReceiverType!
}

input userParam{
	username: String!
	email: String!
	avatar: String
	age: Int!
	phone: String
	firstname: String!
	lastname: String!
	displayName: String!
	bio: String
	type: UserType
	password:String!
}

input channelParam{
	name: String!
	description: String
	displayName: String
	image: String
}

input channelUpdateParam{
	description: String
	displayName: String
	image: String
}

input signupParam{
	username: String!
	email: String!
	avatar: String
	age: Int!
	phone: String
	firstname: String!
	lastname: String!
	displayName: String!
	bio: String
	password:String!
}

input loginParam{
	username:String!
	password:String!
}

enum UserType {
	super
	admin
	user
}

enum ReceiverType{
	channel
	# user
}

`);

export default schema;
