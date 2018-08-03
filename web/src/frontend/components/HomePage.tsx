import { Link } from 'react-router-dom';
import * as React from 'react';
import { State } from '../redux/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State) => {
    return {
        heros: state.heros
    };
};

const mapDispatchToProps = {
};


export const HomePage = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {

    renderHeroButton(playerClass: string, i: number) {
        if (this.props.heros.length < i + 1) return;
        return <td className={playerClass} data-player-id={this.props.heros[i].id}>{ this.props.heros[i].name }</td>;
    }

    render() {
        return <div>
            <h1 id="title1">Turing &nbsp; wars</h1>

            <div id="champSelect">
                <div id="separator"></div>

                <h2 id="player1">Player 1 &nbsp; &#9662;</h2>

                <div id="player2champ" className="champBox">
                    <table>
                        <tbody>
                            <tr>
                                <td className="hidden"></td>
                                { this.renderHeroButton('player2', 0) }
                                { this.renderHeroButton('player2', 1) }
                            </tr>
                            <tr>
                                { this.renderHeroButton('player2', 2) }
                                { this.renderHeroButton('player2', 3) }
                                { this.renderHeroButton('player2', 4) }
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div id="player1champ" className="champBox">
                    <table>
                        <tbody>
                            <tr>
                                { this.renderHeroButton('player1', 0) }
                                { this.renderHeroButton('player1', 1) }
                                { this.renderHeroButton('player1', 2) }
                            </tr>
                            <tr>
                                { this.renderHeroButton('player1', 3) }
                                { this.renderHeroButton('player1', 4) }
                                <td className="hidden"></td>
                            </tr>
                        </tbody>
                    </table>
                    <Link to="/editor">Edit source</Link>
                </div>

                <h2 id="player2">&#9652; &nbsp; Player 2</h2>

                <h3 id="start">Go &#x25B8; &#x25B8;</h3>

            </div>
        </div>;
    }
});
