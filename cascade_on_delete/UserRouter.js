router.delete("/mypage", cors(), validateToken, UserController.deleteMember);

module.exports = router;