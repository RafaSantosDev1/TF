using Backend.Application.DTOs.Answer;
using Backend.Domain;
using Backend.Domain.Repositories;

namespace Backend.Application.Services;

public class AnswerService
{
    private readonly IAnswerRepository _answerRepository;
    private readonly IUserRepository _userRepository;
    private readonly IQuestionRepository _questionRepository;

    public AnswerService(
        IAnswerRepository answerRepository,
        IUserRepository userRepository,
        IQuestionRepository questionRepository)
    {
        _answerRepository = answerRepository;
        _userRepository = userRepository;
        _questionRepository = questionRepository;
    }

    public async Task<AnswerDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var answer = await _answerRepository.GetByIdAsync(id, cancellationToken);
        return answer is null ? null : ToDto(answer);
    }

    public async Task<IEnumerable<AnswerDto>> GetAllByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken = default)
    {
        var answers = await _answerRepository.GetAllByQuestionIdAsync(questionId, cancellationToken);
        return answers.Select(ToDto);
    }

    public async Task<AnswerDto> CreateAsync(CreateAnswerDto dto, CancellationToken cancellationToken = default)
    {
        if (!await _userRepository.ExistsAsync(dto.AuthorId, cancellationToken))
        {
            throw new InvalidOperationException($"Utilizador com Id '{dto.AuthorId}' não existe.");
        }

        if (!await _questionRepository.ExistsAsync(dto.QuestionId, cancellationToken))
        {
            throw new InvalidOperationException($"Pergunta com Id '{dto.QuestionId}' não existe.");
        }

        var answer = new Answer
        {
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            AuthorId = dto.AuthorId,
            QuestionId = dto.QuestionId
        };

        await _answerRepository.AddAsync(answer, cancellationToken);

        var created = await _answerRepository.GetByIdAsync(answer.Id, cancellationToken);
        return ToDto(created!);
    }

    public async Task<AnswerDto?> UpdateAsync(Guid id, UpdateAnswerDto dto, CancellationToken cancellationToken = default)
    {
        var answer = await _answerRepository.GetByIdAsync(id, cancellationToken);
        if (answer is null)
        {
            return null;
        }

        answer.Content = dto.Content;

        await _answerRepository.Update(answer, cancellationToken);
        return ToDto(answer);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var answer = await _answerRepository.GetByIdAsync(id, cancellationToken);
        if (answer is null)
        {
            return false;
        }

        await _answerRepository.Delete(answer, cancellationToken);
        return true;
    }

    public async Task<int> LikeAsync(Guid answerId, Guid userId, CancellationToken cancellationToken = default)
    {
        var answer = await _answerRepository.GetByIdAsync(answerId, cancellationToken);
        if (answer is null)
        {
            throw new KeyNotFoundException($"Resposta com Id '{answerId}' não encontrada.");
        }

        if (!await _userRepository.ExistsAsync(userId, cancellationToken))
        {
            throw new KeyNotFoundException($"Utilizador com Id '{userId}' não encontrado.");
        }

        if (await _answerRepository.UserLikedAsync(userId, answerId, cancellationToken))
        {
            throw new InvalidOperationException("O utilizador já deu like nesta resposta.");
        }

        await _answerRepository.AddLikeAsync(new AnswerLike
        {
            UserId = userId,
            AnswerId = answerId,
            CreatedAt = DateTime.UtcNow
        }, cancellationToken);

        return await _answerRepository.GetLikesCountAsync(answerId, cancellationToken);
    }

    public async Task<int> UnlikeAsync(Guid answerId, Guid userId, CancellationToken cancellationToken = default)
    {
        var answer = await _answerRepository.GetByIdAsync(answerId, cancellationToken);
        if (answer is null)
        {
            throw new KeyNotFoundException($"Resposta com Id '{answerId}' não encontrada.");
        }

        if (!await _userRepository.ExistsAsync(userId, cancellationToken))
        {
            throw new KeyNotFoundException($"Utilizador com Id '{userId}' não encontrado.");
        }

        if (!await _answerRepository.UserLikedAsync(userId, answerId, cancellationToken))
        {
            throw new InvalidOperationException("O utilizador ainda não deu like nesta resposta.");
        }

        await _answerRepository.RemoveLikeAsync(userId, answerId, cancellationToken);

        return await _answerRepository.GetLikesCountAsync(answerId, cancellationToken);
    }

    private static AnswerDto ToDto(Answer answer) => new()
    {
        Id = answer.Id,
        Content = answer.Content,
        CreatedAt = answer.CreatedAt,
        AuthorId = answer.AuthorId,
        AuthorName = answer.Author?.Name ?? string.Empty,
        QuestionId = answer.QuestionId,
        LikesCount = answer.Likes?.Count ?? 0
    };
}