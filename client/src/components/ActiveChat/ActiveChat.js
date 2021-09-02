import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { putMessageRead } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};
  const { unreadMessages, lastMessageOtherRead } = conversation;

  // Read all unread messages for this particular conversation (has to be active for this component to render)
  if (unreadMessages && unreadMessages.length > 0) {
    const reqBody = {
      messages: unreadMessages,
    };

    props.putMessageRead(reqBody);
  }
  
  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              lastMessageOtherRead={lastMessageOtherRead}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input 
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user} 
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putMessageRead: (message) => {
      dispatch(putMessageRead(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
