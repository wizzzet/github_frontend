export default {
  followers (userSlug) { return `github/users/${userSlug}/followers/` },
  repo (userSlug, repoSlug) { return `github/users/${userSlug}/repos/${repoSlug}/` },
  repos (userSlug) { return `github/users/${userSlug}/repos/` },
  user (userSlug) { return `github/users/${userSlug}/` },
  users () { return 'github/users/' }
}
