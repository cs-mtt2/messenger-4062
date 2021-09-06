import React from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  notification: {
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, activeConversation } = props;
  const { otherUser, unreadMessages } = conversation;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };
  
  const shouldDisplayNotification = unreadMessages > 0 && activeConversation !== conversation.otherUser.username;

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} shouldDisplayNotification={shouldDisplayNotification} />
      {shouldDisplayNotification && (
          <Chip className={classes.notification} size="small" color="primary" label={unreadMessages}/>
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
