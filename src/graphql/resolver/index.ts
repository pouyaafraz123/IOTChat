import {
  createUserResolver as createUser,
  deleteUserResolver as deleteUser,
  getCurrentUserResolver as getCurrentUser,
  getUserByEmailResolver as getUserByEmail,
  getUserByUsernameResolver as getUserByUsername,
  getUserChannelsResolver as getUserChannels,
  getUserResolver as getUser,
  getUsersResolver as getUsers,
  loginResolver as login,
  signupResolver as signup,
  updateUserResolver as updateUser,
} from "./userResolver";

import {
  addMemberResolver as addMember,
  createChannelResolver as createChannel,
  deleteChannelResolver as deleteChannel,
  getChannelByNameResolver as getChannelByName,
  getChannelResolver as getChannel,
  getChannelsResolver as getChannels,
  updateChannelResolver as updateChannel,
} from "./channelResolver";

import {
  getChannelMessagesResolver as getChannelMessages,
  sendMessageResolver as sendMessage,
} from "./messageResolver";

export default {
  getUsers,
  getUser,
  getUserByEmail,
  getUserByUsername,
  createUser,
  login,
  getCurrentUser,
  signup,
  updateUser,
  deleteUser,
  getUserChannels,
  createChannel,
  getChannels,
  getChannel,
  getChannelByName,
  addMember,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  sendMessage,
};
