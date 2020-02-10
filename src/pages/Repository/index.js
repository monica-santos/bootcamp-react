/* eslint-disable react/static-property-placement */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { shape, string } from 'prop-types'
import { IssuesList, Label, Loading, Owner } from './styles'
import api from '../../services/api'
import Container from '../../components/Container'

export default class Repository extends Component {
  static propTypes = {
    match: shape({
      params: shape({
        repository: string,
      }),
    }).isRequired,
  }

  state = {
    repository: {},
    issues: [],
    loading: true,
  }

  async componentDidMount() {
    const { match } = this.props
    const repoName = decodeURIComponent(match.params.repository)
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ])

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
    })
  }

  render() {
    const { loading, issues, repository } = this.state
    if (loading) {
      return <Loading>Loading...</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.ligin} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        {issues.length ? (
          <IssuesList>
            {issues.map(issue => (
              <li key={String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login} />
                <div>
                  <strong>
                    <a href={issue.html_url}>{issue.title}</a>
                    {issue.labels.map(label => (
                      <Label key={String(label.id)} color={label.color}>
                        {label.name}
                      </Label>
                    ))}
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))}
          </IssuesList>
        ) : (
          <span>No issues to show...</span>
        )}
      </Container>
    )
  }
}
