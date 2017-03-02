import React, {Component, PropTypes} from 'react'
import { Panel, Row, Col, Table, Button, Glyphicon, Alert } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import moment from 'moment'

import { getConfigProperty } from '../../common/util/config'

export default class GtfsVersionSummary extends Component {
  static propTypes = {
    editor: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { expanded: false }
  }

  isTableIncluded (tableId) {
    if (!this.props.editor.data.tables) return null
    return tableId in this.props.editor.data.tables ? 'Yes' : 'No'
  }

  tableRecordCount (tableId) {
    if (!this.props.editor.data.tables) return null
    if (!(tableId in this.props.editor.data.tables)) return 'N/A'
    return this.props.editor.data.tables[tableId].length.toLocaleString()
  }

  validationIssueCount (tableId) {
    if (!this.props.editor.validation) return null
    if (!(tableId in this.props.editor.validation)) return 'None'
    return this.props.editor.validation[tableId].length.toLocaleString()
  }

  feedStatus () {
    if (!this.props.editor.timestamp) return null
    if (!this.gtfsPlusEdited()) return <i>GTFS+ data for this feed version has not been edited.</i>
    return <b>GTFS+ Data updated {moment(this.props.editor.timestamp).format('MMM. DD, YYYY, h:MMa')}</b>
  }

  gtfsPlusEdited () {
    return (this.props.editor.timestamp !== this.props.version.fileTimestamp)
  }

  render () {
    const {
      gtfsPlusDataRequested,
      user,
      version,
      publishClicked
    } = this.props
    const editingIsDisabled = !user.permissions.hasFeedPermission(version.feedSource.organizationId, version.feedSource.projectId, version.feedSource.id, 'edit-gtfs')
    const publishingIsDisabled = !user.permissions.hasFeedPermission(version.feedSource.organizationId, version.feedSource.projectId, version.feedSource.id, 'approve-gtfs')
    const header = (
      <h3 onClick={() => {
        if (!this.state.expanded) gtfsPlusDataRequested(version)
        this.setState({ expanded: !this.state.expanded })
      }}>
        <Glyphicon glyph='check' /> GTFS+ for this Version
      </h3>
    )

    return (
      <Panel
        header={header}
        collapsible
        expanded={this.state.expanded}
      >
        <Row>
          <Col xs={6}>
            <Alert>{this.feedStatus()}</Alert>
          </Col>
          <Col xs={6} style={{ textAlign: 'right' }}>
            <Button
              bsSize='large'
              disabled={editingIsDisabled}
              bsStyle='primary'
              onClick={() => { browserHistory.push(`/editor/${version.feedSource.id}/${version.id}`) }}
            >
              <Glyphicon glyph='edit' /> Edit GTFS+
            </Button>
            {this.gtfsPlusEdited()
              ? <Button
                bsSize='large'
                disabled={publishingIsDisabled}
                bsStyle='primary'
                style={{ marginLeft: '6px' }}
                onClick={() => {
                  publishClicked(this.props.version)
                  this.setState({ expanded: false })
                }}
              >
                <Glyphicon glyph='upload' /> Publish as New Version
              </Button>
              : null
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table striped>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Included?</th>
                  <th>Records</th>
                  <th>Validation Issues</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {getConfigProperty('modules.editor.spec').map(table => {
                  return (<tr style={{ color: this.isTableIncluded(table.id) === 'Yes' ? 'black' : 'lightGray' }}>
                    <td>{table.name}</td>
                    <td>{this.isTableIncluded(table.id)}</td>
                    <td>{this.tableRecordCount(table.id)}</td>
                    <td>{this.validationIssueCount(table.id)}</td>
                    <td />
                  </tr>)
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Panel>
    )
  }
}