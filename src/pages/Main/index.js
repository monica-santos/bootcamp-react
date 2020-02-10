/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Form, List, SubmitButton } from './styles'
import Container from '../../components/Container'
import api from '../../services/api'

export default class Main extends Component {
  state = {
    repo: '',
    repositories: [],
    loading: false,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories')

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ loading: true })
    const { repo, repositories } = this.state
    const response = await api.get(`/repos/${repo}`)

    const data = {
      name: response.data.full_name,
    }
    this.setState({
      repositories: [...repositories, data],
      repo: '',
      loading: false,
    })
  }

  handleInputChange = e => {
    this.setState({ repo: e.target.value })
  }

  render() {
    const { loading, repo, repositories } = this.state

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={repo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository, i) => (
            <li key={i}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}
